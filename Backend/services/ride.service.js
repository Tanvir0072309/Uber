const rideModel = require('../models/ride.model');
const captainModel = require('../models/captain.model');

// Per-vehicle-type rate — pure distance-based fare, no base fare
const FARE_PER_KM = {
    motorcycle: 6, // Bike
    auto: 8,       // Auto
    car: 12,       // Car
};
const DEFAULT_VEHICLE_TYPE = 'car';

/* Haversine distance in KM between two {lat,lng} points */
function distanceInKm(a, b) {
    const R = 6371; // km
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;

    const h =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
module.exports.distanceInKm = distanceInKm;

/* Distance in METERS — used for the 50m proximity checks */
function distanceInMeters(a, b) {
    return distanceInKm(a, b) * 1000;
}
module.exports.distanceInMeters = distanceInMeters;

function generateOtp() {
    return String(Math.floor(1000 + Math.random() * 9000)); // 4-digit
}
module.exports.generateOtp = generateOtp;

function calculateFare(distanceKm, vehicleType) {
    const rate = FARE_PER_KM[vehicleType] || FARE_PER_KM[DEFAULT_VEHICLE_TYPE];
    return Math.round(distanceKm * rate);
}
module.exports.calculateFare = calculateFare;

/*
 * Sabhi ACTIVE (online) captains dhundo jo `center` se `radiusMeters` ke
 * andar hain. captain.model me location plain {lat,lng} hai (GeoJSON nahi),
 * isliye simple in-memory haversine filter use kar rahe hain — chhoti se
 * medium scale ke liye ye kaafi fast hai.
 */
async function findNearbyCaptains(center, radiusMeters = 10000, vehicleType) {
    const query = {
        status: 'active',
        'location.lat': { $exists: true },
        'location.lng': { $exists: true }
    };
    if (vehicleType) query['vehicle.vehicleType'] = vehicleType;

    const activeCaptains = await captainModel.find(query);

    return activeCaptains
        .map((captain) => {
            const distMeters = distanceInMeters(center, captain.location);
            return { captain, distMeters };
        })
        .filter((c) => c.distMeters <= radiusMeters)
        .sort((a, b) => a.distMeters - b.distMeters);
}
module.exports.findNearbyCaptains = findNearbyCaptains;

/*
 * Create a ride:
 *  - distance seedha haversine se (pickup -> destination)
 *  - duration ek rough estimate (avg 25 km/h shehar ke andar)
 *  - fare = distance * per-km rate (Bike ₹6, Auto ₹8, Car ₹12)
 *  - 500m radius ke andar jitne active captains hain unko dhoondo taaki
 *    controller unhe socket se ride bhej sake
 */
module.exports.createRide = async ({ userId, pickup, destination, pickupCoords, destinationCoords, vehicleType }) => {
    const distance = +distanceInKm(pickupCoords, destinationCoords).toFixed(2);
    const AVG_SPEED_KMPH = 25;
    const duration = Math.max(2, Math.round((distance / AVG_SPEED_KMPH) * 60)); // minutes
    const resolvedVehicleType = vehicleType || DEFAULT_VEHICLE_TYPE;
    const fare = calculateFare(distance, resolvedVehicleType);
    const otp = generateOtp();

    const ride = await rideModel.create({
        user: userId,
        pickup,
        destination,
        pickupCoords,
        destinationCoords,
        distance,
        duration,
        fare,
        otp,
        vehicleType: resolvedVehicleType,
        status: 'pending'
    });

    const nearby = await findNearbyCaptains(pickupCoords, 10000, vehicleType);
    const nearbyCaptains = nearby.map((n) => n.captain);

    return { ride, routeGeometry: null, nearbyCaptains };
};