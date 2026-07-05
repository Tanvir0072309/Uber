import { useState, useRef, useEffect, useCallback } from "react";
import uberLogo from "../assets/images/uber-logo.png";
import mapImg from "../assets/images/map.jpg";

import LocationSearchPanel from "../components/LocationSearchPanel";
import VehicleSelectionPanel from "../components/VehicleSelectionPanel";
import BookingConfirmationPanel from "../components/BookingConfirmationPanel";
import RideDetailsPanel from "../components/RideDetailsPanel";

const STEP_HEIGHT = {
    search: { min: 290, expanded: () => window.innerHeight * 0.85 },
    "vehicle-select": () => window.innerHeight * 0.58,
    "booking-confirm": () => window.innerHeight * 0.62,
    "ride-active": () => window.innerHeight * 0.68,
};

const Home = () => {
    const [pickup, setPickup] = useState("");
    const [destination, setDestination] = useState("");
    const [currentStep, setCurrentStep] = useState("search");
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const panelRef = useRef(null);
    const dragStartY = useRef(0);
    const dragStartHeight = useRef(0);

    const getMinHeight = () => STEP_HEIGHT.search.min;
    const getMaxHeight = () => STEP_HEIGHT.search.expanded();

    const [panelHeight, setPanelHeight] = useState(getMinHeight());
    const [isDragging, setIsDragging] = useState(false);

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

    const handleDragMove = (clientY) => {
        if (!isDragging) return;
        const deltaY = dragStartY.current - clientY;
        let newHeight = dragStartHeight.current + deltaY;
        const min = getMinHeight() - 30;
        const max = getMaxHeight() + 20;
        if (newHeight < min) newHeight = min;
        if (newHeight > max) newHeight = max;
        setPanelHeight(newHeight);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const threshold = getMinHeight() + (getMaxHeight() - getMinHeight()) / 4;
        setPanelHeight(panelHeight > threshold ? getMaxHeight() : getMinHeight());
    };

    useEffect(() => {
        const onMouseMove = (e) => handleDragMove(e.clientY);
        const onTouchMove = (e) => handleDragMove(e.touches[0].clientY);
        const onMouseUp = () => handleDragEnd();
        const onTouchEnd = () => handleDragEnd();

        if (isDragging) {
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
            window.addEventListener("touchmove", onTouchMove);
            window.addEventListener("touchend", onTouchEnd);
        }

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
        };
    }, [isDragging, panelHeight]);

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
            <header className="absolute top-0 left-0 w-full z-10 flex items-center justify-between px-6 pt-6 pb-4 bg-gradient-to-b from-black/40 to-transparent pointer-events-none">
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

            <div className="absolute inset-0 h-full w-full z-0 bg-neutral-200">
                <img
                    src={mapImg}
                    alt="Map"
                    className="w-full h-full object-cover transition-all duration-500 ease-out"
                    style={{
                        filter: isRideStep ? "brightness(0.85) blur(1px)" : "none",
                        transform: isFullyExpanded ? "scale(1.04)" : "scale(1)",
                    }}
                />
            </div>

            <div
                ref={panelRef}
                style={{ height: `${panelHeight}px` }}
                className={`absolute bottom-0 left-0 w-full bg-white rounded-t-[32px] shadow-[0_-15px_40px_rgba(0,0,0,0.15)] z-20 flex flex-col ${
                    isDragging ? "transition-none" : "transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)"
                }`}
                onClick={() => {
                    if (isSearchStep && !isFullyExpanded) setPanelHeight(getMaxHeight());
                }}
            >
                <div
                    onMouseDown={(e) => handleDragStart(e.clientY)}
                    onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
                    className={`w-full py-3 flex flex-col items-center justify-center touch-none shrink-0 ${
                        isSearchStep ? "cursor-grab active:cursor-grabbing" : "cursor-default"
                    }`}
                >
                    <div className="w-12 h-1.5 bg-neutral-300 rounded-full transition-colors hover:bg-neutral-400" />
                </div>

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
