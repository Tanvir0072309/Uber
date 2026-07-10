const CreditCardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h3m3.75 0h3.75M3.75 6.75h16.5a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5v-7.5a1.5 1.5 0 011.5-1.5z" />
    </svg>
);

const StarIcon = () => (
    <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
    </svg>
);

const BackIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.25" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

const BookingConfirmationPanel = ({ vehicle, pickup, destination, isBooking, bookingError, onCancel, onConfirm }) => {
    const captain = vehicle?.captain;
    const captainName = captain ? `${captain.fullname?.firstname || ""} ${captain.fullname?.lastname || ""}`.trim() : null;
    const photoSrc = captain?._id ? `${import.meta.env.VITE_BASE_URL}/captains/${captain._id}/photo` : null;

    return (
        <div className="flex flex-col h-full min-h-0 animate-fade-in">
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
                <div className="relative pb-4 border-b border-neutral-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="absolute left-0 top-0 h-9 w-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 active:scale-95 transition-all"
                        aria-label="Go back"
                    >
                        <BackIcon />
                    </button>
                    <div className="text-center px-12">
                        <p className="text-sm font-semibold text-neutral-900 tracking-tight">Confirm your ride</p>
                        <p className="text-xs text-neutral-400 mt-1">Review trip details before booking</p>
                    </div>
                </div>

                <div className="flex flex-col items-center py-4">
                    <div className="w-24 h-16 flex items-center justify-center">
                        <img
                            src={vehicle?.img}
                            alt={vehicle?.name}
                            className="w-full h-full object-contain drop-shadow-sm"
                        />
                    </div>
                    <p className="font-semibold text-neutral-900 text-base mt-2 tracking-tight">{vehicle?.name}</p>
                    <p className="text-xs text-emerald-600 font-medium mt-0.5">
                        {vehicle?.etaMin ? `${vehicle.etaMin} min away` : "Nearby"}
                    </p>
                </div>

                {/* Real nearest captain preview — the ride still goes out to every
                    online captain of this type within 500m; whoever accepts first
                    gets it, so this may end up being a different captain. */}
                <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm mb-3">
                    <div className="flex items-center gap-3">
                        {photoSrc ? (
                            <img
                                src={photoSrc}
                                alt={captainName || "Captain"}
                                className="h-11 w-11 rounded-full object-cover shrink-0 bg-neutral-100"
                                onError={(e) => { e.target.style.display = "none"; }}
                            />
                        ) : (
                            <div className="h-11 w-11 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                                {captainName?.charAt(0) || "?"}
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-neutral-900 truncate">
                                    {captainName || "Nearest available captain"}
                                </p>
                                {captain && (
                                    <span className="inline-flex items-center gap-1 text-xs text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full shrink-0">
                                        <StarIcon />
                                        4.9
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-neutral-500 mt-1 truncate">
                                {captain ? `${captain.vehicle?.color || ""} ${captain.vehicle?.vehicleType || ""}`.trim() : "Your request will go out to nearby captains"}
                            </p>
                        </div>
                    </div>

                    {captain?.vehicle?.plate && (
                        <div className="mt-3 flex items-center justify-between rounded-xl bg-neutral-50 border border-neutral-100 px-3 py-2">
                            <span className="text-[11px] text-neutral-500 uppercase tracking-wider">Number plate</span>
                            <span className="text-sm font-semibold text-neutral-900 tracking-wide">
                                {captain.vehicle.plate}
                            </span>
                        </div>
                    )}
                </div>

                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 mt-1 shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">Pick-up</p>
                            <p className="font-medium text-neutral-800 text-sm">{pickup || "Pick-up location"}</p>
                        </div>
                    </div>
                    <div className="h-px bg-neutral-200/70 w-full ml-5" />
                    <div className="flex items-start gap-3">
                        <div className="h-2.5 w-2.5 bg-neutral-900 rounded-[2px] mt-1 shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">Drop-off</p>
                            <p className="font-medium text-neutral-800 text-sm">{destination || "Destination"}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between py-4 px-1 border-t border-neutral-100 mt-2">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                            <CreditCardIcon />
                        </div>
                        <div>
                            <p className="font-semibold text-neutral-900 text-sm tracking-tight">
                                {vehicle?.price ? `₹${vehicle.price}` : "—"}
                            </p>
                            <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Cash · Personal</p>
                        </div>
                    </div>
                    <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
                        Estimated fare
                    </span>
                </div>

                {bookingError && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs border border-red-100 font-medium">
                        {bookingError}
                    </div>
                )}
            </div>

            <div className="flex gap-3 pt-4 shrink-0 border-t border-neutral-100 mt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isBooking}
                    className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-medium py-4 rounded-xl text-sm transition-all active:scale-[0.98] border border-neutral-200/50 disabled:opacity-50"
                >
                    Change
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isBooking}
                    className="flex-[2] bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-4 rounded-xl text-sm shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all active:scale-[0.98] disabled:opacity-60"
                >
                    {isBooking ? "Booking..." : "Book Now"}
                </button>
            </div>
        </div>
    );
};

export default BookingConfirmationPanel;