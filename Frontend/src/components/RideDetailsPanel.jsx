import { useState } from "react";

const PhoneIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="6" y="2" width="12" height="20" rx="2.5" />
        <line x1="11" y1="18.5" x2="13" y2="18.5" strokeLinecap="round" />
    </svg>
);

const CarIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5l1.5-4.5A2.25 2.25 0 016.64 7.5h10.72a2.25 2.25 0 012.14 1.5l1.5 4.5M3 13.5v4.125c0 .621.504 1.125 1.125 1.125h.75c.621 0 1.125-.504 1.125-1.125V16.5m-3 0h18m0-2.5v4.125c0 .621-.504 1.125-1.125 1.125h-.75A1.125 1.125 0 0117.25 18v-1.5M6.75 16.5h10.5" />
        <circle cx="7.5" cy="16.5" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="16.5" cy="16.5" r="1.25" fill="currentColor" stroke="none" />
    </svg>
);

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200";

// Copies the captain's number to the clipboard and shows a small "Copied!"
// popup — used instead of a tel: link, which does nothing confirmable on
// desktop and isn't consistent with the captain-side app.
const CopyPhoneButton = ({ mobile }) => {
    const [copied, setCopied] = useState(false);

    if (!mobile) return null;

    const handleCopy = async (e) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(mobile);
        } catch {
            const el = document.createElement("textarea");
            el.value = mobile;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="relative shrink-0">
            <button
                type="button"
                onClick={handleCopy}
                className="h-11 w-11 rounded-full bg-black hover:bg-neutral-800 text-white flex items-center justify-center shadow-lg shadow-black/25 active:scale-95 transition-all"
                aria-label="Copy captain number"
            >
                <PhoneIcon />
            </button>
            {copied && (
                <div className="absolute -top-9 right-0 bg-neutral-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap">
                    Number copied!
                </div>
            )}
        </div>
    );
};

const RideDetailsPanel = ({
    ride,
    captain,
    pickup,
    destination,
    onCancelRide,
    onEndRide,
    // Live tracking (from Home.jsx, driven by the 'captain-location' socket event)
    remainingKm,   // number | null — road distance left to the current target (pickup, then destination)
    speedKmh,      // number | null — captain's current speed based on consecutive GPS ticks
    phase,         // "to_pickup" | "on_trip" — which leg of the journey we're tracking
}) => {
    const captainName = captain ? `${captain.fullname?.firstname || ""} ${captain.fullname?.lastname || ""}`.trim() : null;
    const photoSrc = captain?._id ? `${import.meta.env.VITE_BASE_URL}/captains/${captain._id}/photo` : null;
    const isOnTrip = phase === "on_trip";

    // No captain has accepted yet — real "searching" state instead of a
    // fabricated ETA and a fake driver card.
    if (!captain) {
        return (
            <div className="flex flex-col items-center justify-center text-center animate-fade-in gap-4 py-6">
                <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-50" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-neutral-900" />
                </span>
                <div>
                    <p className="text-sm font-bold text-neutral-900">Looking for a nearby captain...</p>
                    <p className="text-xs text-neutral-400 mt-1">This usually takes a few seconds</p>
                </div>
                {ride?.fare && (
                    <p className="text-2xl font-black text-neutral-900 tracking-tight">₹{ride.fare}</p>
                )}
                <button
                    type="button"
                    onClick={onCancelRide}
                    className="mt-2 w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold py-3.5 rounded-xl text-sm transition-all active:scale-[0.98] border border-neutral-200/50"
                >
                    Cancel Request
                </button>
            </div>
        );
    }

    // Captain accepted, picked up ho chuka (status "ongoing") — mirrors the
    // CAPTAIN side's own compact NavigationBar exactly: small floating info
    // strip, live speed/remaining-km/fare, and NO action button at all
    // (the captain's dropoff-phase bar only has "Complete Ride", which is
    // captain-only — so on the user side that button is simply omitted).
    if (isOnTrip) {
        return (
            <div className="flex flex-col animate-fade-in">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <img
                            src={photoSrc || DEFAULT_AVATAR}
                            alt={captainName}
                            className="w-11 h-11 rounded-full object-cover shrink-0 bg-neutral-100"
                            onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                        />
                        <div>
                            <p className="font-bold text-neutral-900 text-sm leading-tight">{captainName}</p>
                            <p className="text-[11px] font-semibold text-neutral-400 mt-0.5">Heading to drop-off</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <CopyPhoneButton mobile={captain.mobile} />
                        <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full uppercase tracking-wide">
                            {captain.vehicle?.plate || "On trip"}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="bg-neutral-50 rounded-2xl py-3 text-center">
                        <p className="text-lg font-black text-neutral-900">{speedKmh != null ? Math.round(speedKmh) : "—"}</p>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mt-0.5">KM/H</p>
                    </div>
                    <div className="bg-neutral-50 rounded-2xl py-3 text-center">
                        <p className="text-lg font-black text-neutral-900">{remainingKm != null ? remainingKm.toFixed(1) : "—"}</p>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mt-0.5">KM TO DROP-OFF</p>
                    </div>
                    <div className="bg-neutral-50 rounded-2xl py-3 text-center">
                        <p className="text-lg font-black text-neutral-900">{ride?.fare ? `₹${ride.fare}` : "—"}</p>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mt-0.5">THIS RIDE</p>
                    </div>
                </div>
            </div>
        );
    }

    // Captain accepted, still heading to pickup — "Arriving Soon" with a
    // continuously-playing animation (not a one-shot spinner) so it's clear
    // something is actively happening while the user waits.
    return (
        <div className="flex flex-col animate-fade-in">
            <div>
                <div className="text-center pb-3 border-b border-neutral-100">
                    <div className="w-14 h-14 mx-auto mb-2 flex items-center justify-center rounded-full bg-black text-white shadow-lg">
                        <CarIcon className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-neutral-900 tracking-tight">Captain Arriving Soon</p>
                    <p className="text-xs text-neutral-400 mt-1">
                        {ride?.duration ? `Trip duration ~${ride.duration} min` : "Heading to your pickup point"}
                    </p>
                </div>

                {/* Live remaining distance + speed — only shown once we have a GPS fix on the captain */}
                {(remainingKm != null || speedKmh != null) && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="bg-neutral-50 rounded-2xl py-3 text-center">
                            <p className="text-lg font-black text-neutral-900">
                                {remainingKm != null ? remainingKm.toFixed(1) : "—"}
                            </p>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mt-0.5">KM TO PICKUP</p>
                        </div>
                        <div className="bg-neutral-50 rounded-2xl py-3 text-center">
                            <p className="text-lg font-black text-neutral-900">
                                {speedKmh != null ? Math.round(speedKmh) : "—"}
                            </p>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mt-0.5">KM/H SPEED</p>
                        </div>
                    </div>
                )}

                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 flex flex-col gap-3 mt-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Your trip</p>
                    <div className="flex items-start gap-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 mt-1 shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-neutral-400 uppercase">From</p>
                            <p className="font-semibold text-neutral-900 text-sm">{pickup}</p>
                        </div>
                    </div>
                    <div className="h-px bg-neutral-200/70 w-full ml-5" />
                    <div className="flex items-start gap-3">
                        <div className="h-2.5 w-2.5 bg-neutral-900 rounded-[2px] mt-1 shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-neutral-400 uppercase">To</p>
                            <p className="font-semibold text-neutral-900 text-sm">{destination}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 p-4 rounded-2xl border border-neutral-100 bg-white shadow-sm">
                    <div className="flex items-center gap-4">
                        <img
                            src={photoSrc || DEFAULT_AVATAR}
                            alt={captainName}
                            className="h-14 w-14 rounded-full object-cover shrink-0 bg-neutral-100"
                            onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-neutral-900 text-base tracking-tight">{captainName}</p>
                            <p className="text-xs text-neutral-400 mt-0.5">Verified captain</p>
                        </div>
                        <CopyPhoneButton mobile={captain.mobile} />
                    </div>

                    <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-4">
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Vehicle</p>
                            <p className="font-bold text-neutral-900 text-sm capitalize">{captain.vehicle?.vehicleType}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{captain.vehicle?.color}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Plate</p>
                            <p className="font-extrabold text-neutral-900 text-sm tracking-wide bg-neutral-100 px-2.5 py-1 rounded-lg mt-0.5">
                                {captain.vehicle?.plate}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 px-1">
                    <p className="text-xs text-neutral-400 font-medium">Trip fare</p>
                    <p className="font-extrabold text-neutral-900 text-base">{ride?.fare ? `₹${ride.fare}` : "—"}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-4 shrink-0 border-t border-neutral-100 mt-2">
                <button
                    type="button"
                    onClick={onCancelRide}
                    className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold py-3.5 rounded-xl text-sm transition-all active:scale-[0.98] border border-neutral-200/50"
                >
                    Cancel Ride
                </button>
            </div>
        </div>
    );
};

export default RideDetailsPanel;