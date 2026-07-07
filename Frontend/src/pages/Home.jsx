import { useState, useRef, useEffect, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import uberLogo from "../assets/images/uber-logo.png";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehicleSelectionPanel from "../components/VehicleSelectionPanel";
import BookingConfirmationPanel from "../components/BookingConfirmationPanel";
import RideDetailsPanel from "../components/RideDetailsPanel";

const STEP_HEIGHT = {
    search: { min: 220, expanded: () => window.innerHeight * 0.85 },
    "vehicle-select": () => window.innerHeight * 0.58,
    "booking-confirm": () => window.innerHeight * 0.62,
    "ride-active": () => window.innerHeight * 0.68,
};

const Home = () => {
    const [pickup, setPickup] = useState("");
    const [destination, setDestination] = useState("");
    const [currentStep, setCurrentStep] = useState("search");
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const panelRef = useRef(null);

    const dragStartY = useRef(0);
    const dragStartHeight = useRef(0);

    const getMinHeight = () => STEP_HEIGHT.search.min;
    const getMaxHeight = () => STEP_HEIGHT.search.expanded();

    const [panelHeight, setPanelHeight] = useState(getMinHeight());
    const [isDragging, setIsDragging] = useState(false);

    // ---- MapLibre 3D Initialization ----
    useEffect(() => {
        if (mapRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: "https://tiles.openfreemap.org/styles/liberty",
            center: [72.8634, 22.6916],
            zoom: 14.5,
            pitch: 60,
            bearing: -10,
            attributionControl: false
        });

        map.on("load", () => {
            const layers = map.getStyle().layers;
            let labelLayerId;

            for (let i = 0; i < layers.length; i++) {
                if (layers[i].type === "symbol" && layers[i].layout["text-field"]) {
                    labelLayerId = layers[i].id;
                    break;
                }
            }

            map.addLayer(
                {
                    id: "3d-buildings",
                    source: "openmaptiles",
                    "source-layer": "building",
                    type: "fill-extrusion",
                    minzoom: 13,
                    paint: {
                        "fill-extrusion-color": "#e3e3e3",
                        "fill-extrusion-height": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            13,
                            0,
                            14.5,
                            ["get", "render_height"]
                        ],
                        "fill-extrusion-base": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            13,
                            0,
                            14.5,
                            ["get", "render_min_height"]
                        ],
                        "fill-extrusion-opacity": 0.85
                    }
                },
                labelLayerId
            );
        });

        mapRef.current = map;

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // ---- Center Screen Zoom Handlers ----
    const handleZoomIn = () => {
        if (mapRef.current) {
            mapRef.current.zoomTo(mapRef.current.getZoom() + 1, { duration: 300 });
        }
    };

    const handleZoomOut = () => {
        if (mapRef.current) {
            mapRef.current.zoomTo(mapRef.current.getZoom() - 1, { duration: 300 });
        }
    };

    const setStepHeight = useCallback((step) => {
        if (step === "search") {
            setPanelHeight(getMinHeight());
            return;
        }
        const heightFn = STEP_HEIGHT[step];
        setPanelHeight(typeof heightFn === "function" ? heightFn() : getMinHeight());
    }, []);

    const handleLocationSelect = (p, d) => {
        setPickup(p);
        setDestination(d);
        setCurrentStep("vehicle-select");
        setStepHeight("vehicle-select");
    };

    const handleDestinationChange = (value) => {
        setDestination(value);
        if (pickup.trim() && value.trim().length > 2 && currentStep === "search") {
            setCurrentStep("vehicle-select");
            setStepHeight("vehicle-select");
        }
    };

    const handleExpand = () => {
        if (currentStep === "search") {
            setPanelHeight(getMaxHeight());
        }
    };

    const handleDragStart = (clientY) => {
        if (currentStep !== "search") return;
        setIsDragging(true);
        dragStartY.current = clientY;
        dragStartHeight.current = panelHeight;
    };

    // FIX 1: Event handlers standard definitions ke saath wrapper me optimized kiye
    const handleDragMove = useCallback((clientY) => {
        if (!dragStartY.current) return;
        const deltaY = dragStartY.current - clientY;
        let newHeight = dragStartHeight.current + deltaY;
        const min = getMinHeight() - 30;
        const max = getMaxHeight() + 20;

        if (newHeight < min) newHeight = min;
        if (newHeight > max) newHeight = max;
        setPanelHeight(newHeight);
    }, []);

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
        dragStartY.current = 0; // reset
        const threshold = getMinHeight() + (getMaxHeight() - getMinHeight()) / 4;

        // FIX 2: Functional layout logic update standard criteria par
        setPanelHeight(currentHeight =>
            currentHeight > threshold ? getMaxHeight() : getMinHeight()
        );
    }, []);

    // FIX 3: Event tracking aur render flow ko completely detach kiya panelHeight se
    useEffect(() => {
        const onMouseMove = (e) => handleDragMove(e.clientY);
        const onTouchMove = (e) => handleDragMove(e.touches[0].clientY);
        const onMouseUp = () => handleDragEnd();
        const onTouchEnd = () => handleDragEnd();

        if (isDragging) {
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
            window.addEventListener("touchmove", onTouchMove, { passive: true });
            window.addEventListener("touchend", onTouchEnd);
        }

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
        };
    }, [isDragging, handleDragMove, handleDragEnd]);

    const resetTrip = () => {
        setPickup("");
        setDestination("");
        setSelectedVehicle(null);
        setCurrentStep("search");
        setStepHeight("search");
    };

    const isFullyExpanded = currentStep === "search" && panelHeight > getMinHeight() + 80;
    const isSearchStep = currentStep === "search";
    const isRideStep = currentStep === "ride-active" || currentStep === "booking-confirm";

    return (
        <div className="h-screen w-screen relative overflow-hidden bg-neutral-900 font-sans antialiased select-none">

            {/* Header */}
            <header className="absolute top-0 left-0 w-full z-10 flex items-center justify-between px-6 pt-6 pb-4 pointer-events-none">
                <img
                    src={uberLogo}
                    alt="Uber"
                    className="w-20 h-auto object-contain pointer-events-auto filter drop-shadow-md active:scale-95 transition-transform"
                />
                <button
                    type="button"
                    className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-xl pointer-events-auto active:scale-95 transition-all"
                    aria-label="Profile"
                >
                    <svg className="w-5 h-5 text-neutral-800" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            fillRule="evenodd"
                            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </header>

            {/* Side Floating Zoom Control Buttons */}
            <div className="absolute right-5 top-28 z-30 flex flex-col gap-2">
                <button
                    type="button"
                    onClick={handleZoomIn}
                    className="h-12 w-12 bg-white rounded-xl shadow-2xl text-2xl font-bold flex items-center justify-center text-neutral-800 active:scale-90 active:bg-neutral-100 transition-all border border-neutral-100"
                    aria-label="Zoom In"
                >
                    ＋
                </button>
                <button
                    type="button"
                    onClick={handleZoomOut}
                    className="h-12 w-12 bg-white rounded-xl shadow-2xl text-2xl font-bold flex items-center justify-center text-neutral-800 active:scale-90 active:bg-neutral-100 transition-all border border-neutral-100"
                    aria-label="Zoom Out"
                >
                    －
                </button>
            </div>

            {/* Asli 3D Map View Container */}
            <div className="absolute inset-0 h-full w-full z-0 bg-neutral-200">
                <div
                    ref={mapContainerRef}
                    className="w-full h-full transition-all duration-500 ease-out"
                    style={{
                        filter: isRideStep ? "brightness(0.95)" : "none",
                        transform: isFullyExpanded ? "scale(1.02)" : "scale(1)",
                    }}
                />
            </div>

            {/* Bottom Sliding Sheet Container */}
            <div
                ref={panelRef}
                style={{ height: `${panelHeight}px` }}
                className={`absolute bottom-0 left-0 w-full bg-white rounded-t-[32px] shadow-[0_-15px_40px_rgba(0,0,0,0.15)] z-20 flex flex-col ${isDragging ? "transition-none" : "transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)"
                    }`}
                onClick={() => {
                    if (isSearchStep && !isFullyExpanded) setPanelHeight(getMaxHeight());
                }}
            >
                {/* Drag Handle Bar */}
                <div
                    onMouseDown={(e) => handleDragStart(e.clientY)}
                    onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
                    className={`w-full py-3 flex flex-col items-center justify-center touch-none shrink-0 ${isSearchStep ? "cursor-grab active:cursor-grabbing" : "cursor-default"
                        }`}
                >
                    <div className="w-12 h-1.5 bg-neutral-300 rounded-full transition-colors hover:bg-neutral-400" />
                </div>

                {/* Sub Panels Dynamic Render Injector */}
                <div className="px-6 flex-1 min-h-0 overflow-hidden flex flex-col pb-5">
                    {isSearchStep && (
                        <LocationSearchPanel
                            pickup={pickup}
                            destination={destination}
                            onPickupChange={setPickup}
                            onDestinationChange={handleDestinationChange}
                            isFullyExpanded={isFullyExpanded}
                            onExpand={handleExpand}
                            onSelectLocation={handleLocationSelect}
                        />
                    )}

                    {currentStep === "vehicle-select" && (
                        <VehicleSelectionPanel
                            pickup={pickup}
                            destination={destination}
                            onSelect={(vehicle) => {
                                setSelectedVehicle(vehicle);
                                setCurrentStep("booking-confirm");
                                setStepHeight("booking-confirm");
                            }}
                            onBack={() => {
                                setCurrentStep("search");
                                setPanelHeight(getMaxHeight());
                            }}
                        />
                    )}

                    {currentStep === "booking-confirm" && (
                        <BookingConfirmationPanel
                            vehicle={selectedVehicle}
                            pickup={pickup}
                            destination={destination}
                            onCancel={() => {
                                setCurrentStep("vehicle-select");
                                setStepHeight("vehicle-select");
                            }}
                            onConfirm={() => {
                                setCurrentStep("ride-active");
                                setStepHeight("ride-active");
                            }}
                        />
                    )}

                    {currentStep === "ride-active" && (
                        <RideDetailsPanel
                            vehicle={selectedVehicle}
                            pickup={pickup}
                            destination={destination}
                            onCancelRide={() => {
                                setCurrentStep("vehicle-select");
                                setStepHeight("vehicle-select");
                            }}
                            onEndRide={resetTrip}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;