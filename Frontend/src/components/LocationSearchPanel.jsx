import { useState, useEffect } from "react";
import axios from "axios";

const LocationIcon = () => (
    <svg className="w-5 h-5 text-neutral-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);

const RecentIcon = () => (
    <svg className="w-5 h-5 text-neutral-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const LocationSearchPanel = ({
    pickup,
    destination,
    onPickupChange,
    onDestinationChange,
    isFullyExpanded,
    onExpand,
    onSelectLocation, // (pickup, destination, pickupCoords, destinationCoords) => void
    token,
}) => {
    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [destSuggestions, setDestSuggestions] = useState([]);
    const [activeField, setActiveField] = useState(null);
    const [loading, setLoading] = useState(false);

    const [isPickupSelected, setIsPickupSelected] = useState(false);
    const [isDestSelected, setIsDestSelected] = useState(false);

    // Selected item ke coords yahan rakhte hain taaki "Get a Ride" click par backend ko bhej sakein
    const [pickupCoords, setPickupCoords] = useState(null);
    const [destCoords, setDestCoords] = useState(null);

    const [recentSearches, setRecentSearches] = useState([]);

    // Jab "find a trip" section pehli baar khulta hai, DB se recent searches la lo
    useEffect(() => {
        if (!token) return;
        axios
            .get(`${import.meta.env.VITE_BASE_URL}/rides/recent`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setRecentSearches(res.data || []))
            .catch((err) => console.error("Recent searches fetch error:", err));
    }, [token]);

    const fetchSuggestions = async (query, type) => {
        if (!query || query.trim().length < 3) {
            if (type === "pickup") setPickupSuggestions([]);
            if (type === "destination") setDestSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get("https://nominatim.openstreetmap.org/search", {
                params: {
                    q: query,
                    format: "json",
                    addressdetails: 1,
                    limit: 5,
                    countrycodes: "in"
                },
                headers: { "Accept-Language": "en" }
            });

            const mappedResults = response.data.map((item) => ({
                id: item.place_id,
                title: item.display_name.split(",")[0],
                subtitle: item.display_name.split(",").slice(1).join(",").trim(),
                rawName: item.display_name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
            }));

            if (type === "pickup") setPickupSuggestions(mappedResults);
            if (type === "destination") setDestSuggestions(mappedResults);
        } catch (error) {
            console.error("Nominatim Search Error: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (activeField === "pickup" && !isPickupSelected) fetchSuggestions(pickup, "pickup");
        }, 400);
        return () => clearTimeout(delayDebounceFn);
    }, [pickup, activeField]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (activeField === "destination" && !isDestSelected) fetchSuggestions(destination, "destination");
        }, 400);
        return () => clearTimeout(delayDebounceFn);
    }, [destination, activeField]);

    const handleSuggestionClick = (selectedItem, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const coords = { lat: selectedItem.lat, lng: selectedItem.lng };

        if (activeField === "pickup") {
            onPickupChange(selectedItem.rawName);
            setPickupCoords(coords);
            setIsPickupSelected(true);
            setPickupSuggestions([]);
        } else if (activeField === "destination") {
            onDestinationChange(selectedItem.rawName);
            setDestCoords(coords);
            setIsDestSelected(true);
            setDestSuggestions([]);
        }
        setActiveField(null);
    };

    // Ek purani "recent search" pair ko ek hi tap me dono field me bhar do
    const handleRecentClick = (recent) => {
        onPickupChange(recent.pickup);
        onDestinationChange(recent.destination);
        setPickupCoords(recent.pickupCoords);
        setDestCoords(recent.destinationCoords);
        setIsPickupSelected(true);
        setIsDestSelected(true);
    };

    const handleFinalSubmit = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (isPickupSelected && isDestSelected && pickupCoords && destCoords) {
            onSelectLocation(pickup, destination, pickupCoords, destCoords);
        } else {
            alert("Please select both locations from the given options list!");
        }
    };

    const showFinalButton = isPickupSelected && isDestSelected && pickup.trim().length > 2 && destination.trim().length > 2;

    const currentSuggestions = activeField === "pickup" ? pickupSuggestions : destSuggestions;
    const showRecent = currentSuggestions.length === 0 && !loading && recentSearches.length > 0 &&
        ((activeField === "pickup" && !pickup) || (activeField === "destination" && !destination));

    return (
        <div className="flex flex-col h-full min-h-0 relative pb-2" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 shrink-0">
                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Find a trip</h2>
                <p className="text-[11px] text-neutral-400 font-medium tracking-wide">
                    List me se option select karna compulsory hai.
                </p>
            </div>

            <div className="flex items-stretch gap-3 shrink-0 mt-1 relative bg-white">
                <div className="flex flex-col items-center justify-between py-4 w-5 shrink-0 select-none">
                    <div className="h-2.5 w-2.5 rounded-full bg-neutral-950 shrink-0" />
                    <div className="flex-1 my-1 border-l-2 border-dotted border-neutral-300 w-0" />
                    <div className="h-2.5 w-2.5 bg-neutral-950 shrink-0" />
                </div>

                <div className="flex-1 flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="Add a pick-up location"
                        value={pickup}
                        onChange={(e) => {
                            onPickupChange(e.target.value);
                            setIsPickupSelected(false);
                            setPickupCoords(null);
                            setActiveField("pickup");
                        }}
                        onFocus={() => {
                            onExpand();
                            setActiveField("pickup");
                        }}
                        className={`w-full rounded-xl bg-neutral-50 border pl-4 pr-4 py-3.5 outline-none text-sm font-semibold text-neutral-900 transition-all placeholder-neutral-400 shadow-sm ${activeField === "pickup" ? "border-neutral-900 bg-white" : "border-neutral-100"
                            }`}
                    />

                    <input
                        type="text"
                        placeholder="Enter your destination"
                        value={destination}
                        onChange={(e) => {
                            onDestinationChange(e.target.value);
                            setIsDestSelected(false);
                            setDestCoords(null);
                            setActiveField("destination");
                        }}
                        onFocus={() => {
                            onExpand();
                            setActiveField("destination");
                        }}
                        className={`w-full rounded-xl bg-neutral-50 border pl-4 pr-4 py-3.5 outline-none text-sm font-semibold text-neutral-900 transition-all placeholder-neutral-400 shadow-sm ${activeField === "destination" ? "border-neutral-900 bg-white" : "border-neutral-100"
                            }`}
                    />
                </div>
            </div>

            <div
                className={`mt-3 flex-1 min-h-0 overflow-y-auto no-scrollbar transition-opacity duration-300 ${isFullyExpanded && activeField ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                style={{ paddingBottom: showFinalButton ? "85px" : "15px" }}
            >
                <div className="h-px bg-neutral-100 w-full mb-3" />

                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                        {showRecent ? "Recent Searches" : activeField === "pickup" ? "Suggested Pickups" : "Suggested Destinations"}
                    </h3>
                    {loading && <span className="text-[10px] text-neutral-400 animate-pulse font-semibold">Searching...</span>}
                </div>

                <div className="flex flex-col gap-0.5">
                    {showRecent ? (
                        recentSearches.map((recent) => (
                            <button
                                key={recent._id}
                                type="button"
                                onClick={() => handleRecentClick(recent)}
                                className="flex items-center gap-3 py-2.5 border-b border-neutral-50 last:border-b-0 group active:bg-neutral-50 rounded-xl px-2 -mx-2 text-left w-full"
                            >
                                <div className="h-9 w-9 min-w-[36px] bg-neutral-100 rounded-full flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                                    <RecentIcon />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-neutral-900 text-xs tracking-tight truncate">{recent.pickup}</p>
                                    <p className="text-[11px] text-neutral-500 truncate">→ {recent.destination}</p>
                                </div>
                            </button>
                        ))
                    ) : currentSuggestions.length > 0 ? (
                        currentSuggestions.map((loc) => (
                            <button
                                key={loc.id}
                                type="button"
                                onClick={(e) => handleSuggestionClick(loc, e)}
                                className="flex items-center gap-3 py-2.5 border-b border-neutral-50 last:border-b-0 group active:bg-neutral-50 rounded-xl px-2 -mx-2 text-left w-full"
                            >
                                <div className="h-9 w-9 min-w-[36px] bg-neutral-100 rounded-full flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                                    <LocationIcon />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-neutral-900 text-xs tracking-tight truncate">{loc.title}</p>
                                    <p className="text-[11px] text-neutral-500 truncate">{loc.subtitle}</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        !loading && (pickup || destination) && (
                            <p className="text-xs text-neutral-400 text-center py-5 font-medium">Niche list me se select karein...</p>
                        )
                    )}
                </div>
            </div>

            {showFinalButton && (
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white to-transparent pt-6 pb-2 z-30">
                    <button
                        type="button"
                        onClick={handleFinalSubmit}
                        className="w-full bg-black hover:bg-neutral-950 text-white font-bold py-4 px-4 rounded-xl shadow-xl text-sm text-center tracking-wide uppercase"
                    >
                        Get a Ride
                    </button>
                </div>
            )}
        </div>
    );
};

export default LocationSearchPanel;