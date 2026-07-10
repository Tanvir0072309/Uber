const rideModel = require('../models/ride.model');
const captainModel = require('../models/captain.model');
const rideService = require('../services/ride.service');
// BUG FIX: sendMessageToSocketId was called below (createRide, acceptRide,
// startRide, completeRide) but never imported — this throws
// "ReferenceError: sendMessageToSocketId is not defined" the moment any
// of those run.
const { sendMessageToSocketId } = require('../socket/socket.js');

// POST /rides/create   (user only)
// Yahi call hota hai jab user "Get a Ride" par click karta hai — is se ride
// DB me store ho jati hai (yehi "search history" ban jaati hai user ke liye),
// aur 500m ke andar jitne bhi online captains hain unko socket se ride bheji jaati hai.
module.exports.createRide = async (req, res, next) => {
    try {
        const { pickup, destination, pickupCoords, destinationCoords, vehicleType } = req.body;

        if (!pickup || !destination || !pickupCoords || !destinationCoords) {
            return res.status(400).json({ message: 'pickup, destination aur unke coords zaroori hain.' });
        }

        const { ride, routeGeometry, nearbyCaptains } = await rideService.createRide({
            userId: req.user._id,
            pickup,
            destination,
            pickupCoords,
            destinationCoords,
            vehicleType
        });

        // DEBUG: shows exactly why a captain might not get the popup —
        // either none matched the radius/vehicleType, or one matched but had
        // no live socketId (meaning their tab's socket 'join' never landed,
        // or their connection dropped). Remove these two lines once things
        // are working reliably.
        console.log(`[ride debug] pickup=${JSON.stringify(pickupCoords)} vehicleType=${vehicleType || 'car'} -> ${nearbyCaptains.length} captain(s) matched`);
        nearbyCaptains.forEach((c) => console.log(`  - ${c.fullname?.firstname} (${c._id}) status=${c.status} socketId=${c.socketId || 'MISSING'}`));

        // Har nearby captain ke socket par naya ride request bhejo
        nearbyCaptains.forEach((captain) => {
            if (captain.socketId) {
                sendMessageToSocketId(captain.socketId, {
                    event: 'new-ride',
                    data: {
                        _id: ride._id,
                        pickup: ride.pickup,
                        destination: ride.destination,
                        pickupCoords: ride.pickupCoords,
                        destinationCoords: ride.destinationCoords,
                        fare: ride.fare,
                        distance: ride.distance,
                        duration: ride.duration,
                        vehicleType: ride.vehicleType,
                        // mobile add kiya — captain side call/copy button isi se kaam karega
                        user: { _id: req.user._id, fullname: req.user.fullname, mobile: req.user.mobile }
                    }
                });
            } else {
                console.log(`[ride debug] Skipped ${captain._id} — no socketId saved yet.`);
            }
        });

        const rideObj = ride.toObject();
        res.status(201).json({ ride: rideObj, routeGeometry, nearbyCaptainsCount: nearbyCaptains.length });
    } catch (err) {
        next(err);
    }
};

// GET /rides/recent   (user only) — LocationSearchPanel ke "niche" section ke liye
module.exports.getRecentSearches = async (req, res, next) => {
    try {
        const rides = await rideModel
            .find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('pickup destination pickupCoords destinationCoords');

        res.status(200).json(rides);
    } catch (err) {
        next(err);
    }
};

// GET /rides/nearby-captains?lat=..&lng=..&vehicleType=car   (user only)
// "Get a Pickup" click par isko call karo — 500m radius ke andar jitne bhi
// ONLINE captains hain unki list milegi (list item click -> captain detail page)
module.exports.getNearbyCaptains = async (req, res, next) => {
    try {
        const { lat, lng, vehicleType } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ message: 'lat aur lng query params zaroori hain.' });
        }

        const center = { lat: parseFloat(lat), lng: parseFloat(lng) };
        const nearby = await rideService.findNearbyCaptains(center, 50000, vehicleType || undefined);

        const captains = nearby.map(({ captain, distMeters }) => ({
            _id: captain._id,
            fullname: captain.fullname,
            vehicle: captain.vehicle,
            location: captain.location,
            profileImage: captain.profileImage,
            distanceMeters: Math.round(distMeters)
        }));

        res.status(200).json({ captains, count: captains.length });
    } catch (err) {
        next(err);
    }
};

// POST /rides/accept   (captain only)
module.exports.acceptRide = async (req, res, next) => {
    try {
        const { rideId } = req.body;
        const ride = await rideModel.findOne({ _id: rideId, status: 'pending' });

        if (!ride) {
            return res.status(400).json({ message: 'Ye ride ab available nahi hai.' });
        }

        ride.captain = req.captain._id;
        ride.status = 'accepted';
        await ride.save();

        const populatedRide = await rideModel.findById(ride._id).populate('user', '-password').populate('captain', '-password');
        const userDoc = await require('../models/user.model').findById(ride.user);

        if (userDoc?.socketId) {
            sendMessageToSocketId(userDoc.socketId, { event: 'ride-accepted', data: populatedRide });
        }

        res.status(200).json(populatedRide);
    } catch (err) {
        next(err);
    }
};

// POST /rides/start-ride   (captain only) — OTP verification removed, direct start
module.exports.startRide = async (req, res, next) => {
    try {
        const { rideId } = req.body;
        const ride = await rideModel.findOne({ _id: rideId, captain: req.captain._id }).populate('user', '-password');

        if (!ride) return res.status(404).json({ message: 'Ride nahi mili.' });

        ride.status = 'ongoing';
        await ride.save();

        if (ride.user?.socketId) {
            sendMessageToSocketId(ride.user.socketId, { event: 'ride-started', data: { rideId: ride._id } });
        }

        res.status(200).json(ride);
    } catch (err) {
        next(err);
    }
};

// POST /rides/complete-ride   (captain only)
module.exports.completeRide = async (req, res, next) => {
    try {
        const { rideId } = req.body;
        const ride = await rideModel.findOne({ _id: rideId, captain: req.captain._id }).populate('user', '-password');

        if (!ride) return res.status(404).json({ message: 'Ride nahi mili.' });

        ride.status = 'completed';
        await ride.save();

        if (ride.user?.socketId) {
            sendMessageToSocketId(ride.user.socketId, { event: 'ride-completed', data: { rideId: ride._id } });
        }

        res.status(200).json(ride);
    } catch (err) {
        next(err);
    }
};

// POST /rides/cancel   (user ya captain dono)
module.exports.cancelRide = async (req, res, next) => {
    try {
        const { rideId } = req.body;
        const ride = await rideModel.findById(rideId);
        if (!ride) return res.status(404).json({ message: 'Ride nahi mili.' });

        ride.status = 'cancelled';
        await ride.save();

        res.status(200).json(ride);
    } catch (err) {
        next(err);
    }
};

// GET /rides/history/user
module.exports.getUserHistory = async (req, res, next) => {
    try {
        const rides = await rideModel
            .find({ user: req.user._id, status: 'completed' })
            .sort({ createdAt: -1 })
            .populate('captain', 'fullname vehicle');

        res.status(200).json({ rides, totalRides: rides.length });
    } catch (err) {
        next(err);
    }
};

// GET /rides/history/captain — history + earnings, dono ke liye
module.exports.getCaptainHistory = async (req, res, next) => {
    try {
        const rides = await rideModel
            .find({ captain: req.captain._id, status: 'completed' })
            .sort({ createdAt: -1 })
            .populate('user', 'fullname');

        const totalEarnings = rides.reduce((sum, r) => sum + (r.fare || 0), 0);

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const todaysRides = rides.filter((r) => r.createdAt >= startOfDay);
        const todaysEarnings = todaysRides.reduce((sum, r) => sum + (r.fare || 0), 0);

        res.status(200).json({
            rides,
            totalEarnings,
            totalRides: rides.length,
            todaysEarnings,
            todaysRidesCount: todaysRides.length
        });
    } catch (err) {
        next(err);
    }
};