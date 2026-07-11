import { useState, useRef, useEffect, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import axios from "axios";
import { io as ioClient } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import uberLogo from "../assets/images/uber-logo.png";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehicleSelectionPanel from "../components/VehicleSelectionPanel";
import BookingConfirmationPanel from "../components/BookingConfirmationPanel";
import RideDetailsPanel from "../components/RideDetailsPanel";
import UserProfilePanel from "../components/UserProfilePanel";
import { haversineKm, fetchRoute, ensureRouteLayer, setRouteOnMap, fitRouteBounds } from "../utils/route";

const STEP_HEIGHT = {
    search: { min: 220, expanded: () => window.innerHeight * 0.85 },
    "vehicle-select": () => window.innerHeight * 0.58,
    "booking-confirm": () => window.innerHeight * 0.62,
    // "ride-active" is no longer a fixed vh — it's measured live from the
    // actual RideDetailsPanel content (see the ResizeObserver effect in
    // Home). This is only used as an initial guess before the first
    // measurement lands.
    "ride-active": () => window.innerHeight * 0.4,
};

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200";

const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [user, setUser] = useState(null);
    const [pickup, setPickup] = useState("");
    const [destination, setDestination] = useState("");
    // BUG FIX: these were being sent by LocationSearchPanel's onSelectLocation
    // call but never captured — booking a real ride needs actual coordinates.
    const [pickupCoords, setPickupCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [currentStep, setCurrentStep] = useState("search");
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);
    // On-screen "ride complete" popup fare (replaces alert()) — null = hidden.
    const [completedRideFare, setCompletedRideFare] = useState(null);

    // The user's own live GPS position — used to find online captains near
    // THEM right now (independent of whatever pickup address they typed).
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);

    // The real ride returned by POST /rides/create, and the real captain
    // once one accepts it over the socket (no more dummy driver data).
    const [activeRide, setActiveRide] = useState(null);
    const [acceptedCaptain, setAcceptedCaptain] = useState(null);
    const socketRef = useRef(null);

    // Live captain tracking: captain's current GPS point (from the
    // 'captain-location' socket event), remaining road distance to whichever
    // point they're currently headed to (pickup, then destination once the
    // ride is started), and their current speed derived from consecutive fixes.
    const [captainLocation, setCaptainLocation] = useState(null);
    const [remainingKm, setRemainingKm] = useState(null);
    const [speedKmh, setSpeedKmh] = useState(null);
    const lastCaptainFixRef = useRef(null); // { lat, lng, ts }
    const lastRouteFetchRef = useRef(0);
    const captainMarkerRef = useRef(null);

    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const panelRef = useRef(null);
    // Measures RideDetailsPanel's actual content so the sheet can size
    // itself to "just as tall as the content", instead of a fixed 68vh.
    const rideContentRef = useRef(null);

    const dragStartY = useRef(0);
    const dragStartHeight = useRef(0);

    const getMinHeight = () => STEP_HEIGHT.search.min;
    const getMaxHeight = () => STEP_HEIGHT.search.expanded();

    const [panelHeight, setPanelHeight] = useState(getMinHeight());
    const [isDragging, setIsDragging] = useState(false);

    // Fetch user profile on load
    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setUser(res.data);
                if (res.data?._id) {
                    setAvatarUrl(`${import.meta.env.VITE_BASE_URL}/users/photo/${res.data._id}?t=${Date.now()}`);
                }
            })
            .catch(err => {
                console.error(err);
                localStorage.removeItem("token");
                navigate("/login");
            });
    }, [token, navigate]);

    // Grab the user's current GPS position once — this is what powers
    // "captains near me right now" in the choose-ride screen.
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation not supported by this browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => {
                console.error("Geolocation error:", err);
                setLocationError("Location access denied — enable it to see captains near you.");
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    // Connect to the real backend socket once we know who this user is, so
    // 'ride-accepted' actually reaches them (their socketId gets saved).
    useEffect(() => {
        if (!user?._id) return;

        // BADLA: pehle sirf { transports: ["websocket"] } tha — agar network/host
        // websocket upgrade block karta hai (bahut common on some hosts), to
        // connection silently fail ho jaata hai aur 'join' kabhi backend tak
        // pahuchta hi nahi -> socketId kabhi save nahi hota -> captain ko
        // request kabhi nahi milti. Ab polling fallback bhi hai.
        const socket = ioClient(import.meta.env.VITE_BASE_URL, {
            transports: ["websocket", "polling"],
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("[socket] connected:", socket.id);
            socket.emit("join", { userId: user._id, userType: "user" });
        });

        // BADLA: naya — connection fail hote hi turant console me dikhega,
        // "silent failure" nahi rahega.
        socket.on("connect_error", (err) => {
            console.error("[socket] connect_error:", err.message);
        });

        socket.on("disconnect", (reason) => {
            console.warn("[socket] disconnected:", reason);
        });

        socket.on("ride-accepted", (ride) => {
            setActiveRide(ride);
            setAcceptedCaptain(ride?.captain || null);
        });

        // Captain's live GPS tick, broadcast by the backend while the ride
        // is 'accepted' (heading to pickup) or 'ongoing' (heading to
        // destination). Drives the route line, remaining distance, and speed.
        socket.on("captain-location", ({ location }) => {
            setCaptainLocation(location);
        });

        // Captain tapped "Start Ride" — now tracking pickup -> destination.
        socket.on("ride-started", () => {
            setActiveRide((prev) => (prev ? { ...prev, status: "ongoing" } : prev));
            lastRouteFetchRef.current = 0; // force an immediate re-fetch for the new leg
        });

        // Captain tapped "Complete Ride" — trip is over. Shows an on-screen
        // popup (RideCompleteModal below) instead of a browser alert().
        socket.on("ride-completed", () => {
            setActiveRide((prev) => {
                if (prev?.fare) setCompletedRideFare(prev.fare);
                return prev ? { ...prev, status: "completed" } : prev;
            });
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [user?._id]);

    // ---- Derive which leg we're tracking, and keep remaining-distance /
    //      speed / route-line in sync with the captain's live GPS ticks ----
    const trackingPhase = activeRide?.status === "ongoing" ? "on_trip" : "to_pickup";
    const trackingTarget = trackingPhase === "on_trip" ? destinationCoords : pickupCoords;

    useEffect(() => {
        if (!captainLocation || !trackingTarget) return;

        // Cheap, instant update on every GPS tick (straight-line distance).
        setRemainingKm(haversineKm(captainLocation, trackingTarget));

        // Speed from the delta between this fix and the last one.
        const now = Date.now();
        const last = lastCaptainFixRef.current;
        if (last) {
            const hours = (now - last.ts) / 3600000;
            const km = haversineKm(last, captainLocation);
            if (hours > 0.0005 && km != null) {
                const kmh = km / hours;
                if (kmh < 150) setSpeedKmh(kmh); // ignore GPS-jump outliers
            }
        }
        lastCaptainFixRef.current = { ...captainLocation, ts: now };

        // Move the captain's marker on the map.
        if (mapRef.current) {
            if (!captainMarkerRef.current) {
                const el = document.createElement("div");
                el.style.width = "20px";
                el.style.height = "20px";
                el.style.borderRadius = "50%";
                el.style.background = "#000";
                el.style.border = "3px solid #fff";
                el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.4)";
                captainMarkerRef.current = new maplibregl.Marker({ element: el })
                    .setLngLat([captainLocation.lng, captainLocation.lat])
                    .addTo(mapRef.current);
            } else {
                captainMarkerRef.current.setLngLat([captainLocation.lng, captainLocation.lat]);
            }
        }

        // Real road route — throttled to once every ~8s so we don't hammer OSRM.
        if (now - lastRouteFetchRef.current > 8000) {
            lastRouteFetchRef.current = now;
            fetchRoute(captainLocation, trackingTarget).then((route) => {
                if (!route || !mapRef.current) return;
                setRouteOnMap(mapRef.current, route.geometry);
                fitRouteBounds(mapRef.current, route.geometry, maplibregl);
                // Prefer the real road distance over the straight-line one once we have it.
                setRemainingKm(route.distanceKm);
            });
        }
    }, [captainLocation, trackingTarget]);

    // Size the sheet to RideDetailsPanel's actual content height instead of
    // a fixed 68vh — so a short "on trip" card doesn't leave a big empty
    // gap, and a taller "Arriving Soon" card isn't clipped.
    useEffect(() => {
        if (currentStep !== "ride-active") return;
        const el = rideContentRef.current;
        if (!el) return;

        const CHROME = 44; // drag-handle row + top/bottom breathing room
        const MIN_H = 220;

        const update = () => {
            const maxH = window.innerHeight * 0.85;
            const target = Math.min(Math.max(el.scrollHeight + CHROME, MIN_H), maxH);
            setPanelHeight(target);
        };

        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [currentStep, activeRide?.status, acceptedCaptain]);

    // Clean up route/marker once the trip ends.
    useEffect(() => {
        if (currentStep !== "ride-active") {
            if (mapRef.current) setRouteOnMap(mapRef.current, null);
            if (captainMarkerRef.current) {
                captainMarkerRef.current.remove();
                captainMarkerRef.current = null;
            }
            lastCaptainFixRef.current = null;
            lastRouteFetchRef.current = 0;
            setCaptainLocation(null);
            setRemainingKm(null);
            setSpeedKmh(null);
        }
    }, [currentStep]);

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
                            13, 0, 14.5, ["get", "render_height"]
                        ],
                        "fill-extrusion-base": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            13, 0, 14.5, ["get", "render_min_height"]
                        ],
                        "fill-extrusion-opacity": 0.85
                    }
                },
                labelLayerId
            );

            ensureRouteLayer(map, { color: "#000000", width: 5 });
        });

        mapRef.current = map;

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

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

    // STRICT VALIDATION: Ab pure app me sirf isi button click handler se step change hoga!
    const handleLocationSelect = (p, d, pCoords, dCoords) => {
        setPickup(p);
        setDestination(d);
        setPickupCoords(pCoords);
        setDestinationCoords(dCoords);
        setCurrentStep("vehicle-select");
        setStepHeight("vehicle-select");
    };

    // STRICT CLEANUP: Dono inputs ke local handlers sirf pure state badlenge, koi page transition nahi!
    const handlePickupChange = (value) => {
        setPickup(value);
    };

    const handleDestinationChange = (value) => {
        setDestination(value);
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
        dragStartY.current = 0;
        const threshold = getMinHeight() + (getMaxHeight() - getMinHeight()) / 4;

        setPanelHeight(currentHeight =>
            currentHeight > threshold ? getMaxHeight() : getMinHeight()
        );
    }, []);

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
        setPickupCoords(null);
        setDestinationCoords(null);
        setSelectedVehicle(null);
        setActiveRide(null);
        setAcceptedCaptain(null);
        setCurrentStep("search");
        setStepHeight("search");
    };

    // Real booking — sends the actual coords to the backend, which then
    // pushes 'new-ride' over the socket to every online captain of this
    // vehicleType within 500m of the pickup point. Whichever one accepts
    // first becomes `acceptedCaptain` above (via the 'ride-accepted' listener).
    const [isBooking, setIsBooking] = useState(false);
    const [bookingError, setBookingError] = useState("");
    const handleConfirmBooking = async () => {
        if (!pickupCoords || !destinationCoords) {
            setBookingError("Pickup/destination location missing — please reselect from the list.");
            return;
        }
        setIsBooking(true);
        setBookingError("");
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/create`,
                {
                    pickup,
                    destination,
                    pickupCoords,
                    destinationCoords,
                    vehicleType: selectedVehicle?.vehicleType || "car",
                    // BUG FIX: without this, the backend broadcast the ride to
                    // EVERY nearby captain of this vehicleType, regardless of
                    // which specific one the user tapped in "Choose a ride".
                    captainId: selectedVehicle?.captain?._id,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setActiveRide(res.data.ride);
            // DEBUG: tells you exactly how many captains the backend actually
            // notified. If this is 0, no one will ever accept — check the
            // console output below, and see the troubleshooting notes.
            console.log(
                `[ride debug] notified ${res.data.notifiedCaptainsCount}/${res.data.nearbyCaptainsCount} nearby captain(s) — targeted captainId=${selectedVehicle?.captain?._id || "none"}`
            );
            setCurrentStep("ride-active");
            setStepHeight("ride-active");
        } catch (err) {
            console.error("Ride creation failed:", err);
            setBookingError(err?.response?.data?.message || "Ride book nahi ho paayi. Dobara try karein.");
        } finally {
            setIsBooking(false);
        }
    };

    // Cancel is allowed for both user and captain on the backend.
    const handleCancelRide = async () => {
        try {
            if (activeRide?._id) {
                await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/rides/cancel`,
                    { rideId: activeRide._id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
        } catch (err) {
            console.error("Cancel ride failed:", err);
        } finally {
            resetTrip();
        }
    };

    const handleLogout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    const handleProfileUpdated = (updatedUser) => {
        setUser(updatedUser);
        setAvatarUrl(`${import.meta.env.VITE_BASE_URL}/users/photo/${updatedUser._id}?t=${Date.now()}`);
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
                    onClick={() => setIsProfileOpen(true)}
                    className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-xl pointer-events-auto active:scale-95 transition-all overflow-hidden border border-neutral-100"
                    aria-label="Profile"
                >
                    <img
                        src={avatarUrl}
                        alt="Profile Icon"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                    />
                </button>
            </header>

            {/* Side Floating Zoom Control Buttons */}
            <div className="absolute right-5 top-28 z-30 flex flex-col gap-2">
                <button
                    type="button"
                    onClick={handleZoomIn}
                    className="h-12 w-12 bg-white rounded-xl shadow-2xl text-2xl font-bold flex items-center justify-center text-neutral-800 active:scale-90 active:bg-neutral-100 transition-all border border-neutral-100"
                >
                    ＋
                </button>
                <button
                    type="button"
                    onClick={handleZoomOut}
                    className="h-12 w-12 bg-white rounded-xl shadow-2xl text-2xl font-bold flex items-center justify-center text-neutral-800 active:scale-90 active:bg-neutral-100 transition-all border border-neutral-100"
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
                className={`absolute bottom-0 left-0 w-full bg-white rounded-t-[32px] shadow-[0_-15px_40px_rgba(0,0,0,0.15)] z-20 flex flex-col ${isDragging ? "transition-none" : "transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)"}`}
                onClick={() => {
                    if (isSearchStep && !isFullyExpanded) setPanelHeight(getMaxHeight());
                }}
            >
                {/* Drag Handle Bar */}
                <div
                    onMouseDown={(e) => handleDragStart(e.clientY)}
                    onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
                    className={`w-full py-3 flex flex-col items-center justify-center touch-none shrink-0 ${isSearchStep ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
                >
                    <div className="w-12 h-1.5 bg-neutral-300 rounded-full transition-colors hover:bg-neutral-400" />
                </div>

                {/* Sub Panels Dynamic Render Injector */}
                <div className="px-6 flex-1 min-h-0 overflow-hidden flex flex-col pb-5">
                    {isSearchStep && (
                        <LocationSearchPanel
                            pickup={pickup}
                            destination={destination}
                            onPickupChange={handlePickupChange}
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
                            pickupCoords={pickupCoords}
                            destinationCoords={destinationCoords}
                            token={token}
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
                            isBooking={isBooking}
                            bookingError={bookingError}
                            onCancel={() => {
                                setCurrentStep("vehicle-select");
                                setStepHeight("vehicle-select");
                            }}
                            onConfirm={handleConfirmBooking}
                        />
                    )}

                    {currentStep === "ride-active" && completedRideFare == null && (
                        <div ref={rideContentRef} className="overflow-y-auto max-h-full">
                            <RideDetailsPanel
                                ride={activeRide}
                                captain={acceptedCaptain}
                                pickup={pickup}
                                destination={destination}
                                onCancelRide={handleCancelRide}
                                onEndRide={resetTrip}
                                remainingKm={remainingKm}
                                speedKmh={speedKmh}
                                phase={trackingPhase}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* RIDE COMPLETE POPUP — replaces the old alert() */}
            {completedRideFare != null && (
                <div
                    className="absolute inset-0 z-[60] bg-black/40 flex items-center justify-center px-6"
                    onClick={() => { setCompletedRideFare(null); resetTrip(); }}
                >
                    <div
                        className="bg-white rounded-3xl p-6 w-full max-w-xs text-center shadow-2xl animate-[popUp_0.25s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="font-bold text-neutral-900 text-base">Ride complete!</p>
                        <p className="text-sm text-neutral-500 mt-1">Fare: ₹{completedRideFare}</p>
                        <button
                            type="button"
                            onClick={() => { setCompletedRideFare(null); resetTrip(); }}
                            className="mt-5 w-full bg-neutral-900 hover:bg-black text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-[0.98]"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

            {/* DYNAMIC USER PROFILE SLIDING OVERLAY */}
            {isProfileOpen && user && (
                <UserProfilePanel
                    user={user}
                    token={token}
                    onClose={() => setIsProfileOpen(false)}
                    onProfileUpdated={handleProfileUpdated}
                    onLogout={handleLogout}
                />
            )}

            <style>{`
                @keyframes popUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Home;