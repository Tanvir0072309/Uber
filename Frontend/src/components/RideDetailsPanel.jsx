const PhoneIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-1.066 1.466a11.04 11.04 0 01-5.516-5.517l1.466-1.066c.362-.271.527-.733.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
);

const StarIcon = () => (
    <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005z" clipRule="evenodd" />
    </svg>
);

const RideDetailsPanel = ({ vehicle, pickup, destination, onCancelRide, onEndRide }) => {
    const driver = vehicle?.driver;

    return (
        <div className="flex flex-col h-full min-h-0 animate-fade-in">
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
                <div className="text-center pb-3 border-b border-neutral-100">
                    <p className="text-sm font-bold text-neutral-900 tracking-tight flex items-center justify-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        Driver is on the way
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">Arriving in {vehicle?.time?.replace(" away", "") || "2 mins"}</p>
                </div>

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
                        <div className="h-14 w-14 rounded-full bg-neutral-900 text-white flex items-center justify-center text-lg font-bold shrink-0">
                            {driver?.name?.charAt(0) || "D"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-neutral-900 text-base tracking-tight">{driver?.name || "Your driver"}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                                <StarIcon />
                                <span className="text-xs font-semibold text-neutral-600">{driver?.rating || "4.9"}</span>
                                <span className="text-xs text-neutral-400">· Verified captain</span>
                            </div>
                        </div>
                        <a
                            href={`tel:${driver?.phone}`}
                            className="h-11 w-11 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 active:scale-95 transition-all shrink-0"
                            aria-label="Call driver"
                        >
                            <PhoneIcon />
                        </a>
                    </div>

                    <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-4">
                        <div className="w-20 h-14 flex items-center justify-center bg-neutral-50 rounded-xl border border-neutral-100 p-1 shrink-0">
                            <img src={vehicle?.img} alt={vehicle?.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Vehicle</p>
                            <p className="font-bold text-neutral-900 text-sm">{vehicle?.name}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{driver?.model}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Plate</p>
                            <p className="font-extrabold text-neutral-900 text-sm tracking-wide bg-neutral-100 px-2.5 py-1 rounded-lg mt-0.5">
                                {driver?.plate || "GJ 01 XX 0000"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 px-1">
                    <p className="text-xs text-neutral-400 font-medium">Trip fare</p>
                    <p className="font-extrabold text-neutral-900 text-base">{vehicle?.price}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-4 shrink-0 border-t border-neutral-100 mt-2">
                <button
                    type="button"
                    onClick={onEndRide}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-4 rounded-xl text-sm tracking-wide uppercase shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all active:scale-[0.98]"
                >
                    End Trip
                </button>
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
