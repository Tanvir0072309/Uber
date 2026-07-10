import { useState, useEffect } from "react";
import axios from "axios";
import carImg from "../assets/images/vehicles/car.png";
import bikeImg from "../assets/images/vehicles/bike.png";
import autoImg from "../assets/images/vehicles/auto.png";

const PersonIcon = ({ className = "w-3 h-3" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
);

const BackIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

/* Static per-type display info only — no fake drivers, prices, or ETAs here anymore. */
const VEHICLE_TYPES = [
    { id: "car", name: "UberGo", img: carImg, capacity: 4, desc: "Affordable, compact rides" },
    { id: "motorcycle", name: "Moto", img: bikeImg, capacity: 1, desc: "Affordable motorcycle rides" },
    { id: "auto", name: "UberAuto", img: autoImg, capacity: 3, desc: "Doorstep auto rides" },
];

const AVG_SPEED_KMPH = 25;
const FARE_PER_KM = {
    motorcycle: 6,
    auto: 8,
    car: 12,
};

/* Same haversine formula the backend uses, so the estimate shown here
   matches the fare the server will actually charge. */
function distanceInKm(a, b) {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;
    const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

const VehicleSelectionPanel = ({ pickup, destination, pickupCoords, destinationCoords, userLocation, locationError, token, onSelect, onBack }) => {
    const [captainsByType, setCaptainsByType] = useState({ car: [], motorcycle: [], auto: [] });
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");

    // Real nearby-captains lookup, centered on the USER's current GPS
    // position (not the typed pickup address) — "who's online near me right now".
    useEffect(() => {
        if (!userLocation) return;

        setLoading(true);
        setFetchError("");

        axios
            .get(`${import.meta.env.VITE_BASE_URL}/rides/nearby-captains`, {
                params: { lat: userLocation.lat, lng: userLocation.lng },
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const grouped = { car: [], motorcycle: [], auto: [] };
                (res.data?.captains || []).forEach((c) => {
                    const type = c.vehicle?.vehicleType;
                    if (grouped[type]) grouped[type].push(c);
                });
                Object.keys(grouped).forEach((type) => grouped[type].sort((a, b) => a.distanceMeters - b.distanceMeters));
                setCaptainsByType(grouped);
            })
            .catch((err) => {
                console.error("Nearby captains fetch error:", err);
                setFetchError("Couldn't load nearby captains. Pull down to retry.");
            })
            .finally(() => setLoading(false));
    }, [userLocation, token]);

    return (
        <div className="flex flex-col h-full min-h-0 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4 shrink-0">
                <button
                    type="button"
                    onClick={onBack}
                    className="h-9 w-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 active:scale-95 transition-all shrink-0"
                    aria-label="Go back"
                >
                    <BackIcon />
                </button>
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-neutral-900 tracking-tight truncate">Choose a ride</h2>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                        {pickup} → {destination}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-3 shrink-0">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Captains near you</h3>
                {loading && <span className="text-[10px] text-neutral-500 animate-pulse font-semibold">Searching...</span>}
            </div>

            {locationError && (
                <div className="mb-3 p-3 bg-amber-50 text-amber-700 rounded-xl text-xs border border-amber-100 font-medium shrink-0">
                    {locationError}
                </div>
            )}
            {fetchError && (
                <div className="mb-3 p-3 bg-red-50 text-red-600 rounded-xl text-xs border border-red-100 font-medium shrink-0">
                    {fetchError}
                </div>
            )}

            <div className="flex flex-col gap-2.5 flex-1 min-h-0 overflow-y-auto no-scrollbar pb-1">
                {VEHICLE_TYPES.map((type) => {
                    const captains = captainsByType[type.id] || [];
                    const nearest = captains[0];
                    const available = captains.length > 0;
                    const etaMin = nearest ? Math.max(1, Math.round((nearest.distanceMeters / 1000 / AVG_SPEED_KMPH) * 60)) : null;

                    const specificFareEstimate =
                        pickupCoords && destinationCoords
                            ? (() => {
                                const km = distanceInKm(pickupCoords, destinationCoords);
                                const rate = FARE_PER_KM[type.id] || 0;
                                return { km: km.toFixed(1), price: Math.round(km * rate) };
                            })()
                            : null;

                    return (
                        <button
                            key={type.id}
                            type="button"
                            disabled={!available}
                            onClick={() =>
                                available &&
                                onSelect({
                                    vehicleType: type.id,
                                    name: type.name,
                                    img: type.img,
                                    captain: nearest,
                                    etaMin,
                                    price: specificFareEstimate?.price,
                                    distanceKm: specificFareEstimate?.km,
                                })
                            }
                            className={`flex items-center justify-between p-4 border rounded-2xl transition-all duration-200 group text-left w-full shrink-0 ${available
                                ? "bg-neutral-50 hover:bg-neutral-900 border-neutral-100 hover:border-neutral-900 active:scale-[0.99]"
                                : "bg-neutral-50/50 border-neutral-100 opacity-50 cursor-not-allowed"
                                }`}
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-16 h-12 flex items-center justify-center bg-white rounded-xl border border-neutral-100 shadow-sm p-1 shrink-0 group-hover:bg-neutral-800 transition-colors">
                                    <img src={type.img} alt={type.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-neutral-900 group-hover:text-white text-sm tracking-tight transition-colors">
                                            {type.name}
                                        </p>
                                        <span className="inline-flex items-center gap-0.5 text-[10px] bg-neutral-200/70 group-hover:bg-neutral-800 px-1.5 py-0.5 rounded font-bold text-neutral-600 group-hover:text-neutral-300 transition-all">
                                            <PersonIcon />
                                            {type.capacity}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        {available ? (
                                            <>
                                                <p className="text-xs font-semibold text-emerald-600 group-hover:text-emerald-400 transition-colors">
                                                    {etaMin} min away
                                                </p>
                                                <span className="text-neutral-300 group-hover:text-neutral-600">·</span>
                                                <p className="text-xs text-neutral-400 group-hover:text-neutral-300 truncate transition-colors">
                                                    {captains.length} nearby
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-xs text-neutral-400">No captains online nearby</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p className="text-base font-extrabold text-neutral-900 group-hover:text-white tracking-tight transition-colors ml-3 shrink-0">
                                {available && specificFareEstimate ? `₹${specificFareEstimate.price}` : "—"}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default VehicleSelectionPanel;