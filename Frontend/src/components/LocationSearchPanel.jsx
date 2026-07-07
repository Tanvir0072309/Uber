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
            {/* Header section ki margin bottom kam ki (mb-4 -> mb-2) */}
            <div className="mb-2 shrink-0">
                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Find a trip</h2>
                <p className="text-[11px] text-neutral-400 font-medium tracking-wide">
                    Enter street names or landmarks for faster matching.
                </p>
            </div>

            {/* Input fields ka vertical gap aur size thoda kam kiya (gap-3 -> gap-2, py-4 -> py-3) */}
            <div className="relative flex flex-col gap-2 shrink-0 mt-1">
                <RouteLine />
                <input
                    type="text"
                    placeholder="Add a pick-up location"
                    value={pickup}
                    onChange={(e) => onPickupChange(e.target.value)}
                    onFocus={onExpand}
                    className="w-full rounded-xl bg-neutral-50 border border-neutral-100 pl-12 pr-4 py-3 outline-none text-sm font-semibold text-neutral-900 focus:border-neutral-900 focus:bg-white transition-all placeholder-neutral-400 shadow-sm"
                />
                <input
                    type="text"
                    placeholder="Enter your destination"
                    value={destination}
                    onChange={(e) => onDestinationChange(e.target.value)}
                    onFocus={onExpand}
                    className="w-full rounded-xl bg-neutral-50 border border-neutral-100 pl-12 pr-4 py-3 outline-none text-sm font-semibold text-neutral-900 focus:border-neutral-900 focus:bg-white transition-all placeholder-neutral-400 shadow-sm"
                />
            </div>

            {/* Suggestions wrapper ki margin top kam ki (mt-5 -> mt-3) */}
            <div
                className={`mt-3 flex-1 min-h-0 overflow-y-auto no-scrollbar transition-opacity duration-300 ${isFullyExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            >
                <div className="h-px bg-neutral-100 w-full mb-3" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                    Suggested locations
                </h3>

                {/* List items ki padding tight ki (py-3.5 -> py-2.5) */}
                <div className="flex flex-col pb-2">
                    {SUGGESTED_LOCATIONS.map((loc, index) => (
                        <button
                            key={loc.id}
                            type="button"
                            onClick={() => onSelectLocation(loc.pickup, loc.destination)}
                            className="flex items-center gap-3 py-2.5 border-b border-neutral-50 last:border-b-0 group active:bg-neutral-50 rounded-xl px-2 -mx-2 transition-colors text-left w-full"
                        >
                            <div className="h-9 w-9 min-w-[36px] bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                                {index === 0 ? <ClockIcon /> : <LocationIcon />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-neutral-900 text-xs tracking-tight">{loc.title}</p>
                                <p className="text-[11px] text-neutral-500 truncate">{loc.subtitle}</p>
                            </div>
                            <svg
                                className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-500 shrink-0 transition-colors"
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