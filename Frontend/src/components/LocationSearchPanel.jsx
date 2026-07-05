import RouteLine from "./RouteLine";

const SUGGESTED_LOCATIONS = [
    {
        id: "alpha-one",
        title: "Alpha One Mall",
        subtitle: "Vastrapur, Ahmedabad, Gujarat",
        pickup: "Alpha One Mall, Vastrapur",
        destination: "Kalupur Railway Station",
    },
    {
        id: "kalupur",
        title: "Kalupur Railway Station",
        subtitle: "Railway Station Rd, Kalupur, Ahmedabad",
        pickup: "Kalupur Railway Station",
        destination: "Sardar Vallabhbhai Patel Airport",
    },
    {
        id: "sg-highway",
        title: "SG Highway",
        subtitle: "Satellite, Ahmedabad, Gujarat",
        pickup: "SG Highway, Satellite",
        destination: "GIFT City, Gandhinagar",
    },
];

const LocationIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const LocationSearchPanel = ({
    pickup,
    destination,
    onPickupChange,
    onDestinationChange,
    isFullyExpanded,
    onExpand,
    onSelectLocation,
}) => {
    return (
        <div className="flex flex-col h-full min-h-0">
            <div className="mb-4 shrink-0">
                <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Find a trip</h2>
                <p className="text-xs text-neutral-400 font-medium mt-0.5 tracking-wide">
                    Enter street names or landmarks for faster matching.
                </p>
            </div>

            <div className="relative flex flex-col gap-3 shrink-0">
                <RouteLine />
                <input
                    type="text"
                    placeholder="Add a pick-up location"
                    value={pickup}
                    onChange={(e) => onPickupChange(e.target.value)}
                    onFocus={onExpand}
                    className="w-full rounded-2xl bg-neutral-50 border border-neutral-100 pl-14 pr-6 py-4 outline-none text-base font-semibold text-neutral-900 focus:border-neutral-900 focus:bg-white transition-all placeholder-neutral-400 shadow-sm"
                />
                <input
                    type="text"
                    placeholder="Enter your destination"
                    value={destination}
                    onChange={(e) => onDestinationChange(e.target.value)}
                    onFocus={onExpand}
                    className="w-full rounded-2xl bg-neutral-50 border border-neutral-100 pl-14 pr-6 py-4 outline-none text-base font-semibold text-neutral-900 focus:border-neutral-900 focus:bg-white transition-all placeholder-neutral-400 shadow-sm"
                />
            </div>

            <div
                className={`mt-5 flex-1 min-h-0 overflow-y-auto no-scrollbar transition-opacity duration-300 ${
                    isFullyExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
                <div className="h-px bg-neutral-100 w-full mb-4" />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                    Suggested locations
                </h3>

                <div className="flex flex-col pb-2">
                    {SUGGESTED_LOCATIONS.map((loc, index) => (
                        <button
                            key={loc.id}
                            type="button"
                            onClick={() => onSelectLocation(loc.pickup, loc.destination)}
                            className="flex items-center gap-4 py-3.5 border-b border-neutral-100 last:border-b-0 group active:bg-neutral-50 rounded-xl px-2 -mx-2 transition-colors text-left w-full"
                        >
                            <div className="h-10 w-10 min-w-[40px] bg-neutral-100 rounded-full flex items-center justify-center text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                                {index === 0 ? <ClockIcon /> : <LocationIcon />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-neutral-900 text-sm tracking-tight">{loc.title}</p>
                                <p className="text-xs text-neutral-500 truncate mt-0.5">{loc.subtitle}</p>
                            </div>
                            <svg
                                className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 shrink-0 transition-colors"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LocationSearchPanel;
