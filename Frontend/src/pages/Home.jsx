import { useState } from "react";
import mapImg from "../assets/images/map.jpg";

const CaptainHome = () => {
    // --- कैप्टन स्टेट्स (UNCHANGED LOGIC) ---
    const [isOnline, setIsOnline] = useState(true);
    const [hasRequest, setHasRequest] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const rideRequest = {
        passengerName: "Esther Berry",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
        paymentMethod: "ApplePay",
        fare: "$25.00",
        distance: "2.2 km",
        pickup: "7958 Swift Village, Apt. 43",
        destination: "105 William St, Chicago, US",
        notes: "Please arrive near the main entrance gate.",
        orderId: "#123456"
    };

    const handleIgnore = () => {
        setHasRequest(false);
        setIsExpanded(false);
    };

    return (
        <div className="h-screen w-screen relative overflow-hidden bg-neutral-100 font-sans antialiased select-none text-black">

            {/* AUTHENTIC UBER SIDEBAR SLIDING MENU */}
            <div
                className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsSidebarOpen(false)}
            >
                <div
                    className={`w-80 h-full bg-white flex flex-col justify-between transform transition-transform duration-250 ease-out shadow-xl ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div>
                        {/* Uber Driver User Header */}
                        <div className="bg-black text-white p-6 pt-12 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-normal tracking-tight font-mono">Uber</span>
                                <button onClick={() => setIsSidebarOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="w-12 h-12 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden">
                                    <img src={mapImg} alt="Driver" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="font-medium text-lg leading-tight">Uber Captain</p>
                                    <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Pro Partner
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation List */}
                        <nav className="p-4 space-y-1">
                            <a href="#profile" className="flex items-center gap-4 px-4 py-4 rounded-lg bg-neutral-100 text-black font-medium text-sm transition-all">
                                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Account Profile
                            </a>
                            <a href="#earnings" className="flex items-center gap-4 px-4 py-4 rounded-lg hover:bg-neutral-50 text-neutral-600 hover:text-black font-medium text-sm transition-all">
                                <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Earnings Dashboard
                            </a>
                            <a href="#history" className="flex items-center gap-4 px-4 py-4 rounded-lg hover:bg-neutral-50 text-neutral-600 hover:text-black font-medium text-sm transition-all">
                                <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Ride History
                            </a>
                            <a href="#settings" className="flex items-center gap-4 px-4 py-4 rounded-lg hover:bg-neutral-50 text-neutral-600 hover:text-black font-medium text-sm transition-all">
                                <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Preferences
                            </a>
                        </nav>
                    </div>

                    <div className="p-6 border-t border-neutral-100 text-xs text-neutral-400 font-normal tracking-wide">
                        Uber Driver App v4.42.10003
                    </div>
                </div>
            </div>

            {/* TOP HEADER BAR (Uber Driver Clean Layout) */}
            <header className="absolute top-0 left-0 w-full z-10 flex items-center justify-between px-4 pt-4 pb-4 pointer-events-none">
                {/* Menu Trigger */}
                <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    className="h-12 w-12 bg-white text-black rounded-full flex items-center justify-center shadow-md pointer-events-auto active:scale-95 transition-all border border-neutral-200"
                    aria-label="Open Menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Center Title Layout */}
                <div className="bg-black text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-md border border-neutral-800">
                    <span className="text-sm font-semibold font-mono tracking-wider">Uber</span>
                    <span className="text-neutral-400 text-xs font-light">|</span>
                    <span className="text-xs font-medium tracking-wide">CAPTAIN</span>
                </div>

                {/* Toggle System Status */}
                <div className="pointer-events-auto">
                    <button
                        type="button"
                        onClick={() => {
                            setIsOnline(!isOnline);
                            if (!isOnline) setHasRequest(true);
                        }}
                        className={`h-12 px-5 rounded-full font-bold text-xs tracking-wider flex items-center gap-2 transition-all duration-200 shadow-md border ${isOnline
                                ? "bg-emerald-600 text-white border-emerald-700"
                                : "bg-white text-neutral-600 border-neutral-300"
                            }`}
                    >
                        <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? "bg-white animate-pulse" : "bg-neutral-300"}`} />
                        {isOnline ? "GO OFFLINE" : "GO ONLINE"}
                    </button>
                </div>
            </header>

            {/* MAP CANVAS COMPONENT */}
            <div className="absolute inset-0 h-full w-full z-0 bg-neutral-200">
                <img
                    src={mapImg}
                    alt="Map Interface"
                    className="w-full h-full object-cover transition-all duration-300"
                    style={{
                        filter: !isOnline ? "brightness(0.7) contrast(1.1) grayscale(0.8)" : "none",
                        transform: isExpanded ? "scale(1.05)" : "scale(1)",
                    }}
                />

                {!isOnline && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs z-10">
                        <div className="bg-white text-black font-medium text-sm px-6 py-4 rounded-xl shadow-xl text-center max-w-xs mx-4 border border-neutral-200">
                            <p className="text-base font-bold mb-1">You are offline</p>
                            <p className="text-xs text-neutral-500">To start receiving ride requests nearby, switch status to online.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* FLAT NATIVE BOTTOM SHEET (Authentic Uber Form Factors) */}
            {isOnline && hasRequest && (
                <div
                    onClick={() => { if (!isExpanded) setIsExpanded(true); }}
                    style={{
                        height: isExpanded ? "100%" : "275px"
                    }}
                    className={`absolute bottom-0 left-0 w-full bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.12)] z-20 flex flex-col justify-between transition-all duration-300 ease-in-out border-t border-neutral-200 md:max-w-md md:left-1/2 md:-translate-x-1/2 md:bottom-4 md:rounded-2xl md:border ${!isExpanded && "cursor-pointer"
                        }`}
                >
                    {/* Native Drag Handle */}
                    <div className="w-full flex justify-center py-3 shrink-0">
                        <div className="w-12 h-1 bg-neutral-300 rounded-full" />
                    </div>

                    {/* COMPACT DISPATCH CARD */}
                    {!isExpanded ? (
                        <div className="flex flex-col h-full justify-between px-5 pb-5">
                            {/* Primary Trip Meta Data Row */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3.5">
                                    <div className="relative">
                                        <img
                                            src={rideRequest.avatar}
                                            alt=""
                                            className="w-14 h-14 rounded-full object-cover border-2 border-neutral-100 bg-neutral-200"
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-white">
                                            <span>4.9</span>
                                            <svg className="w-2.5 h-2.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-neutral-900 text-lg tracking-tight leading-tight">{rideRequest.passengerName}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded uppercase tracking-wide border border-neutral-200">
                                                {rideRequest.paymentMethod}
                                            </span>
                                            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">UberX</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-black tracking-tight leading-none">{rideRequest.fare}</p>
                                    <p className="text-xs text-neutral-500 font-medium mt-1.5">{rideRequest.distance} • 6 min ETA</p>
                                </div>
                            </div>

                            {/* Minimal Address Segment */}
                            <div className="my-3 space-y-2.5 border-y border-neutral-100 py-3 text-sm">
                                <div className="flex items-center gap-3 truncate">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                                    <p className="text-neutral-700 truncate text-xs"><span className="text-neutral-400 font-bold mr-1">PICKUP:</span> {rideRequest.pickup}</p>
                                </div>
                                <div className="flex items-center gap-3 truncate">
                                    <span className="w-2.5 h-2.5 rounded-none bg-black shrink-0" />
                                    <p className="text-neutral-700 truncate text-xs"><span className="text-neutral-400 font-bold mr-1">DROP:</span> {rideRequest.destination}</p>
                                </div>
                            </div>

                            {/* Dispatch Base CTA Row */}
                            <div className="flex items-center justify-between gap-3 pt-0.5 shrink-0">
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleIgnore(); }}
                                    className="text-neutral-500 font-bold text-sm px-4 py-3.5 hover:bg-neutral-50 rounded-xl transition-colors"
                                >
                                    Decline
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
                                    className="flex-1 bg-black hover:bg-neutral-900 text-white font-bold py-4 rounded-xl text-center text-sm tracking-wider active:scale-[0.99] transition-all uppercase"
                                >
                                    Accept Ride Request
                                </button>
                            </div>
                        </div>
                    ) : (

                        /* FULL SCREEN EXPANDED CONSOLE PANEL */
                        <div className="flex flex-col h-full justify-between overflow-y-auto px-5 pb-6">
                            <div className="space-y-5">
                                {/* Header Summary Section */}
                                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                                    <div>
                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Incoming Request</p>
                                        <h3 className="text-xl font-bold text-black mt-0.5">Trip {rideRequest.orderId}</h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                                        className="h-9 w-9 bg-neutral-100 rounded-full flex items-center justify-center text-black hover:bg-neutral-200 transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Passenger Metric Block */}
                                <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-xl border border-neutral-200/60 text-sm">
                                    <div className="flex items-center gap-3">
                                        <img src={rideRequest.avatar} alt="" className="w-12 h-12 rounded-full object-cover border bg-white" />
                                        <div>
                                            <p className="text-neutral-400 text-xs font-medium">Rider Profile</p>
                                            <p className="font-bold text-black text-base">{rideRequest.passengerName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-neutral-400 text-xs font-medium">Payment</p>
                                        <p className="font-bold text-neutral-800 text-base flex items-center gap-1 justify-end">
                                            <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                            {rideRequest.paymentMethod}
                                        </p>
                                    </div>
                                </div>

                                {/* Complete Route Timeline Display */}
                                <div className="space-y-2.5">
                                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Route Logistics</span>
                                    <div className="text-sm text-neutral-800 bg-neutral-50 p-4 rounded-xl border border-neutral-200/60 space-y-5 relative">
                                        <div className="absolute left-[21px] top-9 bottom-9 w-0.5 bg-neutral-300" />

                                        <div className="flex gap-4 relative z-10">
                                            <span className="w-3 h-3 rounded-full bg-emerald-600 mt-1 shrink-0 ring-4 ring-emerald-100" />
                                            <div>
                                                <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-wide">Pickup Point</p>
                                                <p className="font-semibold text-black mt-0.5 text-sm">{rideRequest.pickup}</p>
                                                <p className="text-xs text-neutral-400 mt-0.5">ETA: 6 mins away • {rideRequest.distance}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 relative z-10">
                                            <span className="w-3 h-3 rounded-none bg-black mt-1 shrink-0 ring-4 ring-neutral-200" />
                                            <div>
                                                <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-wide">Dropoff Destination</p>
                                                <p className="font-semibold text-black mt-0.5 text-sm">{rideRequest.destination}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes Module */}
                                <div className="space-y-2">
                                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Rider Dispatch Instructions</span>
                                    <div className="flex gap-2.5 items-start bg-neutral-50 p-4 rounded-xl border border-neutral-200/60">
                                        <svg className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                                        <p className="text-xs text-neutral-600 italic leading-relaxed">
                                            "{rideRequest.notes}"
                                        </p>
                                    </div>
                                </div>

                                {/* Payout Breakdown Indicator */}
                                <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
                                    <div>
                                        <span className="text-sm text-neutral-500 font-medium block">Net Payout Estimate</span>
                                        <span className="text-xs text-neutral-400 font-normal">Includes surging fees & toll clearances</span>
                                    </div>
                                    <span className="text-3xl font-black text-black tracking-tight">{rideRequest.fare}</span>
                                </div>
                            </div>

                            {/* Consolidated Action Stack */}
                            <div className="flex flex-col gap-3 pt-6 mt-auto">
                                <button
                                    type="button"
                                    className="w-full bg-neutral-100 hover:bg-neutral-200 text-black font-bold py-4 rounded-xl text-sm transition-all border border-neutral-300 flex justify-center items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    Call Passenger
                                </button>
                                <button
                                    type="button"
                                    onClick={() => alert("Navigating to Client Location...")}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4.5 rounded-xl text-sm tracking-wider uppercase active:scale-[0.99] transition-all text-center"
                                >
                                    Navigate To Pickup
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CaptainHome;