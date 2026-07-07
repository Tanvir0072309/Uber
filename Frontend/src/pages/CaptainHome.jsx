import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mapImg from "../assets/images/map.jpg";
import carImg from "../assets/images/vehicles/car.png";
import bikeImg from "../assets/images/vehicles/bike.png";
import autoImg from "../assets/images/vehicles/auto.png";

/* =========================================================================
   AXIOS INSTANCE — talks to your real backend (routes you shared).
   Assumes VITE_BASE_URL is set in your .env, same pattern used elsewhere
   in the project. Token is read from localStorage on every request.
   ========================================================================= */
const BASE_URL = import.meta.env.VITE_BASE_URL;
const api = axios.create({
    baseURL: BASE_URL,
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

/* Vehicle type -> your own image assets */
const vehicleImages = { car: carImg, motorcycle: bikeImg, auto: autoImg };

/* Stock fallback photo, used until the captain uploads their own */
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200";

/* Photo is now served through OUR OWN backend (/captains/:id/photo), which
   streams it from Cloudinary server-side. The real Cloudinary URL is never
   sent to the browser, so it's not visible in Network tab / Inspect Element —
   only our own backend URL is. */
const resolveAvatar = (captain) => {
    if (!captain?.profileImage || !captain?._id) return DEFAULT_AVATAR;
    const base = (BASE_URL || "").replace(/\/+$/, "");
    return `${base}/captains/${captain._id}/photo`;
};

/* =========================================================================
   ICONS
   ========================================================================= */
const MenuIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);
const CloseIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const ChevronDownIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);
const ChevronRightIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);
const UserIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const WalletIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-1M17 12a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18" />
    </svg>
);
const ClockIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const GearIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const StarIcon = ({ className = "w-3 h-3" }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);
const CardIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);
const PhoneIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);
const NoteIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
);
const LogoutIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);
const NavArrowIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6" />
    </svg>
);
const BellIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .53-.21 1.04-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);
const ShieldIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
    </svg>
);
const GlobeIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3c2.5 2.7 4 6.1 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6.1-4-9s1.5-6.3 4-9z" />
    </svg>
);
const HelpIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 2-3 4m.09 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const PencilIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.5-9.5a2.121 2.121 0 013 3L12 16l-4 1 1-4 8.5-8.5z" />
    </svg>
);

/* =========================================================================
   MOCK LIVE-REQUEST FEED
   Replace this with your socket.io "new-ride" event payloads — the UI
   below already supports any number of simultaneous requests.
   ========================================================================= */
const MOCK_REQUESTS = [
    {
        id: "req-1",
        passengerName: "Esther Berry",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
        paymentMethod: "ApplePay",
        fare: "$25.00",
        distance: "2.2 km",
        eta: "6 min",
        tripDistance: "6.8 km",
        pickup: "7958 Swift Village, Apt. 43",
        destination: "105 William St, Chicago, US",
        notes: "Please arrive near the main entrance gate.",
        orderId: "#123456",
    },
    {
        id: "req-2",
        passengerName: "Daniel Cole",
        avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=150",
        paymentMethod: "Cash",
        fare: "$14.50",
        distance: "1.1 km",
        eta: "3 min",
        tripDistance: "3.4 km",
        pickup: "22 Baker Street",
        destination: "Lincoln Park Zoo",
        notes: "",
        orderId: "#123457",
    },
    {
        id: "req-3",
        passengerName: "Priya Nair",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150",
        paymentMethod: "Card",
        fare: "$32.75",
        distance: "4.6 km",
        eta: "11 min",
        tripDistance: "9.2 km",
        pickup: "Millennium Park",
        destination: "O'Hare Terminal 2",
        notes: "Carrying two large bags.",
        orderId: "#123458",
    },
];

/* =========================================================================
   SIDEBAR
   ========================================================================= */
const Sidebar = ({ isOpen, onClose, activeMenu, onNavigate, captain, onLogout }) => {
    const navItems = [
        { key: "profile", label: "My Profile", icon: UserIcon },
        { key: "earnings", label: "Earnings", icon: WalletIcon },
        { key: "history", label: "Ride History", icon: ClockIcon },
    ];
    const displayName = captain ? `${captain.fullname?.firstname || ""} ${captain.fullname?.lastname || ""}`.trim() : "Captain";

    return (
        <div
            className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            onClick={onClose}
        >
            <div
                className={`w-[300px] max-w-[82vw] h-full bg-white flex flex-col justify-between transform transition-transform duration-300 ease-out shadow-2xl ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div>
                    <div className="bg-black text-white px-6 pt-8 pb-6 flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-black tracking-tighter">Uber</span>
                            <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors" aria-label="Close menu">
                                <CloseIcon />
                            </button>
                        </div>
                        <button onClick={() => onNavigate("profile")} className="flex items-center gap-3 mt-1 text-left">
                            <img
                                src={resolveAvatar(captain)}
                                alt="Driver"
                                className="w-12 h-12 rounded-full object-cover border border-neutral-700"
                            />
                            <div>
                                <p className="font-semibold text-base leading-tight">{displayName || "Captain"}</p>
                                <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-1">
                                    <StarIcon className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    4.92 &middot; Uber Pro Gold
                                </p>
                            </div>
                        </button>
                    </div>

                    <nav className="p-3 mt-2 space-y-0.5">
                        {navItems.map(({ key, label, icon: ItemIcon }) => (
                            <button
                                key={key}
                                onClick={() => onNavigate(key)}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm transition-all ${activeMenu === key ? "bg-neutral-100 text-black font-semibold" : "text-neutral-600 hover:bg-neutral-50 hover:text-black font-medium"}`}
                            >
                                <ItemIcon className={`w-5 h-5 ${activeMenu === key ? "text-black" : "text-neutral-400"}`} />
                                {label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-neutral-100">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-3.5 rounded-2xl bg-neutral-50 text-sm active:scale-[0.98] transition-all"
                    >
                        <LogoutIcon className="w-4 h-4" />
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

/* =========================================================================
   HEADER
   ========================================================================= */
const Header = ({ onMenuClick, isOnline, onToggleOnline }) => (
    <header className="absolute top-0 left-0 w-full z-30 flex items-center justify-between px-4 pt-4 pb-4 pointer-events-none">
        <button type="button" onClick={onMenuClick} className="h-11 w-11 bg-white text-black rounded-full flex items-center justify-center shadow-md pointer-events-auto active:scale-95 transition-all" aria-label="Open menu">
            <MenuIcon />
        </button>
        <div className="bg-white px-4 py-2 rounded-full flex items-center gap-2 shadow-md pointer-events-auto">
            <span className="text-base font-black tracking-tighter text-black leading-none">Uber</span>
            <span className="w-px h-3.5 bg-neutral-300" />
            <span className="text-[11px] font-bold tracking-widest text-neutral-500 uppercase leading-none">Captain</span>
        </div>
        <div className="pointer-events-auto">
            <button
                type="button"
                onClick={onToggleOnline}
                className={`h-11 px-4 rounded-full font-bold text-xs tracking-wider flex items-center gap-2 shadow-md transition-all duration-200 ${isOnline ? "bg-black text-white" : "bg-white text-neutral-500"}`}
            >
                <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-white animate-pulse" : "bg-neutral-400"}`} />
                {isOnline ? "ONLINE" : "OFFLINE"}
            </button>
        </div>
    </header>
);

/* =========================================================================
   SWIPEABLE REQUEST STACK
   Multiple requests pop up from the bottom as stacked floating cards.
   Top card: drag left to decline, drag right to accept, or tap the
   cross icon to dismiss instantly. Tap the card (without dragging) to
   expand full trip details.
   ========================================================================= */
const SwipeableRequestCard = ({ request, stackIndex, isExpanded, setIsExpanded, onAccept, onDecline }) => {
    const [dragX, setDragX] = useState(0);
    const dragging = useRef(false);
    const startX = useRef(0);
    const moved = useRef(false);
    const isTop = stackIndex === 0;

    const handlePointerDown = (e) => {
        if (!isTop || isExpanded) return;
        dragging.current = true;
        moved.current = false;
        startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    };
    const handlePointerMove = (e) => {
        if (!dragging.current) return;
        const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
        const delta = x - startX.current;
        if (Math.abs(delta) > 4) moved.current = true;
        setDragX(delta);
    };
    const handlePointerUp = () => {
        if (!dragging.current) return;
        dragging.current = false;
        const threshold = 110;
        if (dragX > threshold) {
            onAccept(request);
        } else if (dragX < -threshold) {
            onDecline(request.id);
        }
        setDragX(0);
    };
    const handleClick = () => {
        if (moved.current) { moved.current = false; return; }
        if (isTop && !isExpanded) setIsExpanded(true);
    };

    // Non-top cards: peek behind the active card to show a stack.
    if (!isTop) {
        const depth = Math.min(stackIndex, 2);
        return (
            <div
                className="absolute left-4 right-4 mx-auto max-w-sm bg-white rounded-3xl shadow-lg pointer-events-none transition-all duration-300"
                style={{
                    bottom: `${24 + depth * 6}px`,
                    height: "270px",
                    transform: `scale(${1 - depth * 0.04})`,
                    opacity: depth === 1 ? 0.85 : 0.6,
                    zIndex: 30 - depth,
                }}
            />
        );
    }

    const rotate = dragX / 18;
    const acceptGlow = dragX > 40 ? Math.min((dragX - 40) / 90, 1) : 0;
    const declineGlow = dragX < -40 ? Math.min((-dragX - 40) / 90, 1) : 0;

    return (
        <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onClick={handleClick}
            style={{
                height: isExpanded ? "100%" : "280px",
                transform: isExpanded ? "none" : `translateX(${dragX}px) rotate(${rotate}deg)`,
                zIndex: 40,
                touchAction: "pan-y",
            }}
            className={`absolute bottom-0 left-0 w-full bg-white shadow-[0_-10px_36px_rgba(0,0,0,0.16)] flex flex-col justify-between transition-transform duration-200 ease-out md:max-w-sm md:left-1/2 md:-translate-x-1/2 md:bottom-6 md:rounded-3xl animate-[popUp_0.35s_ease-out] ${!isExpanded ? "cursor-grab active:cursor-grabbing rounded-t-3xl" : ""}`}
        >
            {/* Swipe direction glows */}
            {!isExpanded && acceptGlow > 0 && (
                <div className="absolute inset-0 rounded-t-3xl md:rounded-3xl bg-neutral-900 pointer-events-none" style={{ opacity: acceptGlow * 0.12 }} />
            )}
            {!isExpanded && declineGlow > 0 && (
                <div className="absolute inset-0 rounded-t-3xl md:rounded-3xl bg-red-500 pointer-events-none" style={{ opacity: declineGlow * 0.12 }} />
            )}

            {/* Cross icon — quick dismiss */}
            {!isExpanded && (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDecline(request.id); }}
                    className="absolute top-3 right-3 h-8 w-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-200 active:scale-90 transition-all z-10"
                    aria-label="Dismiss request"
                >
                    <CloseIcon className="w-4 h-4" />
                </button>
            )}

            <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 bg-neutral-200 rounded-full" />
            </div>

            {!isExpanded ? (
                <div className="flex flex-col h-full justify-between px-5 pb-5 pt-1">
                    <div className="flex items-start justify-between pr-8">
                        <div className="flex items-center gap-3.5">
                            <div className="relative shrink-0">
                                <img src={request.avatar} alt="" className="w-14 h-14 rounded-full object-cover" />
                                <div className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border-2 border-white">
                                    <span>4.9</span>
                                    <StarIcon className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-black text-lg tracking-tight leading-tight">{request.passengerName}</h4>
                                <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1 mt-1.5 w-fit">
                                    <CardIcon className="w-3 h-3" />
                                    {request.paymentMethod}
                                </span>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-2xl font-black text-black tracking-tight leading-none">{request.fare}</p>
                            <p className="text-xs text-neutral-400 font-medium mt-1.5">{request.distance} &bull; {request.eta}</p>
                        </div>
                    </div>

                    <div className="my-3 space-y-2.5 border-y border-neutral-100 py-3.5 text-xs">
                        <div className="flex items-center gap-3 truncate">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                            <p className="text-neutral-700 truncate"><span className="text-neutral-400 font-bold mr-1">PICKUP</span> {request.pickup}</p>
                        </div>
                        <div className="flex items-center gap-3 truncate">
                            <span className="w-2.5 h-2.5 bg-black shrink-0 rounded-sm" />
                            <p className="text-neutral-700 truncate"><span className="text-neutral-400 font-bold mr-1">DROP-OFF</span> {request.destination}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 shrink-0">
                        <button type="button" onClick={(e) => { e.stopPropagation(); onDecline(request.id); }} className="text-neutral-500 font-bold text-sm px-4 py-3.5 hover:bg-neutral-50 rounded-xl transition-colors">
                            Ignore
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); onAccept(request); }} className="flex-1 bg-black hover:bg-neutral-900 text-white font-bold py-4 rounded-2xl text-center text-sm tracking-wider uppercase active:scale-[0.98] transition-all">
                            Accept Request
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-neutral-300 font-medium -mt-1">swipe right to accept &bull; swipe left to skip</p>
                </div>
            ) : (
                <div className="flex flex-col h-full justify-between overflow-y-auto px-5 pb-6">
                    <div className="space-y-5">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                            <div>
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Incoming Request</p>
                                <h3 className="text-xl font-bold text-black mt-0.5">Trip {request.orderId}</h3>
                            </div>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} className="h-9 w-9 bg-neutral-100 rounded-full flex items-center justify-center text-black hover:bg-neutral-200 transition-all" aria-label="Collapse">
                                <ChevronDownIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-2xl text-sm">
                            <div className="flex items-center gap-3">
                                <img src={request.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <p className="text-neutral-400 text-xs font-medium">Passenger</p>
                                    <p className="font-bold text-black text-base flex items-center gap-1">
                                        {request.passengerName}
                                        <span className="flex items-center gap-0.5 text-xs font-bold text-neutral-500 ml-1"><StarIcon className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.9</span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-neutral-400 text-xs font-medium">Payment</p>
                                <p className="font-bold text-neutral-800 text-base flex items-center gap-1 justify-end"><CardIcon className="w-4 h-4 text-neutral-600" />{request.paymentMethod}</p>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Route</span>
                            <div className="text-sm text-neutral-800 bg-neutral-50 p-4 rounded-2xl space-y-5 relative">
                                <div className="absolute left-[21px] top-9 bottom-9 w-0.5 bg-neutral-200" />
                                <div className="flex gap-4 relative z-10">
                                    <span className="w-3 h-3 rounded-full bg-emerald-600 mt-1 shrink-0 ring-4 ring-emerald-50" />
                                    <div>
                                        <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-wide">Pickup</p>
                                        <p className="font-semibold text-black mt-0.5 text-sm">{request.pickup}</p>
                                        <p className="text-xs text-neutral-400 mt-0.5">ETA {request.eta} &bull; {request.distance}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 relative z-10">
                                    <span className="w-3 h-3 bg-black mt-1 shrink-0 ring-4 ring-neutral-100 rounded-sm" />
                                    <div>
                                        <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-wide">Drop-off</p>
                                        <p className="font-semibold text-black mt-0.5 text-sm">{request.destination}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {request.notes && (
                            <div className="space-y-2">
                                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Note from Passenger</span>
                                <div className="flex gap-2.5 items-start bg-neutral-50 p-4 rounded-2xl">
                                    <NoteIcon className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                                    <p className="text-xs text-neutral-600 italic leading-relaxed">&ldquo;{request.notes}&rdquo;</p>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
                            <div>
                                <span className="text-sm text-neutral-500 font-medium block">Net Earnings</span>
                                <span className="text-xs text-neutral-400">Includes fare, tolls &amp; fees</span>
                            </div>
                            <span className="text-3xl font-black text-black tracking-tight">{request.fare}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-6 mt-auto shrink-0">
                        <button type="button" onClick={(e) => { e.stopPropagation(); onDecline(request.id); }} className="w-full bg-neutral-100 hover:bg-neutral-200 text-black font-bold py-4 rounded-2xl text-sm transition-all">
                            Ignore
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); onAccept(request); }} className="w-full bg-black hover:bg-neutral-900 text-white font-black py-4 rounded-2xl text-sm tracking-wider uppercase active:scale-[0.98] transition-all flex justify-center items-center gap-2">
                            <NavArrowIcon className="w-4 h-4" />
                            Accept &amp; Go To Pickup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const RequestStack = ({ requests, isExpanded, setIsExpanded, onAccept, onDecline }) => (
    <>
        {requests.slice(0, 3).map((r, i) => (
            <SwipeableRequestCard
                key={r.id}
                request={r}
                stackIndex={i}
                isExpanded={i === 0 && isExpanded}
                setIsExpanded={setIsExpanded}
                onAccept={onAccept}
                onDecline={onDecline}
            />
        ))}
        {requests.length > 1 && !isExpanded && (
            <div className="absolute top-20 right-4 z-50 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                +{requests.length - 1} more request{requests.length - 1 > 1 ? "s" : ""}
            </div>
        )}
    </>
);

/* =========================================================================
   ACCEPTED RIDE — FULL DETAIL SECTION (not a floating card anymore).
   Opens as a proper full-screen page over the map, shows every trip
   detail (passenger, route, notes, earnings), and ends with a single
   Navigate action pinned at the bottom. Black / white theme only.
   ========================================================================= */
const AcceptedRideDetails = ({ ride, onCancel, onNavigate }) => (
    <div className="absolute inset-0 z-40 bg-white flex flex-col animate-[popUp_0.35s_ease-out]">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm flex items-center gap-4 px-5 py-4 shadow-[0_1px_0_rgba(0,0,0,0.06)] z-10 shrink-0">
            <button onClick={onCancel} className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95 transition-all" aria-label="Cancel ride">
                <ChevronRightIcon className="w-4 h-4 rotate-180" />
            </button>
            <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Ongoing Trip</p>
                <h1 className="text-lg font-bold text-black tracking-tight">Trip {ride.orderId}</h1>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-6 space-y-5">
            <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-2xl text-sm">
                <div className="flex items-center gap-3">
                    <img src={ride.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                    <div>
                        <p className="text-neutral-400 text-xs font-medium">Passenger</p>
                        <p className="font-bold text-black text-base flex items-center gap-1">
                            {ride.passengerName}
                            <span className="flex items-center gap-0.5 text-xs font-bold text-neutral-500 ml-1"><StarIcon className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.9</span>
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-neutral-400 text-xs font-medium">Payment</p>
                    <p className="font-bold text-neutral-800 text-base flex items-center gap-1 justify-end"><CardIcon className="w-4 h-4 text-neutral-600" />{ride.paymentMethod}</p>
                </div>
            </div>

            <div className="space-y-2.5">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Route</span>
                <div className="text-sm text-neutral-800 bg-neutral-50 p-4 rounded-2xl space-y-5 relative">
                    <div className="absolute left-[21px] top-9 bottom-9 w-0.5 bg-neutral-200" />
                    <div className="flex gap-4 relative z-10">
                        <span className="w-3 h-3 rounded-full bg-black mt-1 shrink-0 ring-4 ring-neutral-100" />
                        <div>
                            <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-wide">Pickup</p>
                            <p className="font-semibold text-black mt-0.5 text-sm">{ride.pickup}</p>
                            <p className="text-xs text-neutral-400 mt-0.5">ETA {ride.eta} &bull; {ride.distance}</p>
                        </div>
                    </div>
                    <div className="flex gap-4 relative z-10">
                        <span className="w-3 h-3 bg-black mt-1 shrink-0 ring-4 ring-neutral-100 rounded-sm" />
                        <div>
                            <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-wide">Drop-off</p>
                            <p className="font-semibold text-black mt-0.5 text-sm">{ride.destination}</p>
                        </div>
                    </div>
                </div>
            </div>

            {ride.notes && (
                <div className="space-y-2">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Note from Passenger</span>
                    <div className="flex gap-2.5 items-start bg-neutral-50 p-4 rounded-2xl">
                        <NoteIcon className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-neutral-600 italic leading-relaxed">&ldquo;{ride.notes}&rdquo;</p>
                    </div>
                </div>
            )}

            <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
                <div>
                    <span className="text-sm text-neutral-500 font-medium block">Net Earnings</span>
                    <span className="text-xs text-neutral-400">Includes fare, tolls &amp; fees</span>
                </div>
                <span className="text-3xl font-black text-black tracking-tight">{ride.fare}</span>
            </div>
        </div>

        {/* Navigate sits at the very end of the detail section, not floating over the map */}
        <div className="shrink-0 px-5 pb-5 pt-3 border-t border-neutral-100 flex gap-3">
            <button onClick={onCancel} className="px-5 bg-neutral-100 hover:bg-neutral-200 text-black font-bold py-3.5 rounded-2xl text-sm transition-all">
                Cancel
            </button>
            <button onClick={onNavigate} className="flex-1 bg-black hover:bg-neutral-900 text-white font-black py-3.5 rounded-2xl text-sm tracking-wider uppercase active:scale-[0.98] transition-all flex justify-center items-center gap-2">
                <NavArrowIcon className="w-4 h-4" />
                Navigate
            </button>
        </div>
    </div>
);

/* =========================================================================
   NAVIGATION BAR — bottom-of-page live tracking strip shown once the
   captain hits "Navigate". Two phases:
     "pickup"  -> heading to the passenger: speed, distance to passenger,
                  which passenger-number today, today's total earnings,
                  Picked Passenger / Cancel Ride buttons.
     "dropoff" -> passenger picked up: speed, distance left on this ride,
                  this ride's fare, which ride-number today.
   Speed/distance here are simulated locally — swap in real GPS/live
   telemetry whenever that's wired up.
   ========================================================================= */
const NavigationBar = ({ phase, ride, speed, distanceKm, rideNumberToday, todaysEarnings, onPickedPassenger, onCancelRide, onCompleteRide }) => (
    <div className="absolute bottom-0 left-0 w-full z-40 bg-white rounded-t-3xl shadow-[0_-10px_36px_rgba(0,0,0,0.16)] px-5 pt-4 pb-5 animate-[popUp_0.35s_ease-out]">
        <div className="w-full flex justify-center mb-3">
            <div className="w-10 h-1 bg-neutral-200 rounded-full" />
        </div>

        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
                <img src={ride.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
                <div>
                    <p className="font-bold text-black text-sm leading-tight">{ride.passengerName}</p>
                    <p className="text-[11px] font-semibold text-neutral-400 mt-0.5">
                        {phase === "pickup" ? "Heading to passenger" : "Heading to drop-off"}
                    </p>
                </div>
            </div>
            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full uppercase tracking-wide">
                {phase === "pickup" ? `Passenger #${rideNumberToday} today` : `Ride #${rideNumberToday} today`}
            </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-neutral-50 rounded-2xl py-3 text-center">
                <p className="text-lg font-black text-black">{speed}</p>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mt-0.5">KM/H</p>
            </div>
            <div className="bg-neutral-50 rounded-2xl py-3 text-center">
                <p className="text-lg font-black text-black">{distanceKm}</p>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mt-0.5">
                    {phase === "pickup" ? "KM TO PASSENGER" : "KM TO DROP-OFF"}
                </p>
            </div>
            <div className="bg-neutral-50 rounded-2xl py-3 text-center">
                <p className="text-lg font-black text-black">{phase === "pickup" ? todaysEarnings : ride.fare}</p>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mt-0.5">
                    {phase === "pickup" ? "EARNED TODAY" : "THIS RIDE"}
                </p>
            </div>
        </div>

        {phase === "pickup" ? (
            <div className="flex gap-3 mt-4">
                <button onClick={onCancelRide} className="px-5 bg-neutral-100 hover:bg-neutral-200 text-black font-bold py-3.5 rounded-2xl text-sm transition-all">
                    Cancel Ride
                </button>
                <button onClick={onPickedPassenger} className="flex-1 bg-black hover:bg-neutral-900 text-white font-black py-3.5 rounded-2xl text-sm tracking-wider uppercase active:scale-[0.98] transition-all">
                    Picked Passenger
                </button>
            </div>
        ) : (
            <button onClick={onCompleteRide} className="w-full mt-4 bg-black hover:bg-neutral-900 text-white font-black py-3.5 rounded-2xl text-sm tracking-wider uppercase active:scale-[0.98] transition-all">
                Complete Ride
            </button>
        )}
    </div>
);


const PageShell = ({ title, onBack, children }) => (
    <div className="h-screen w-screen bg-white overflow-y-auto">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm flex items-center gap-4 px-5 py-4 z-10 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
            <button onClick={onBack} className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center active:scale-95 transition-all" aria-label="Back to map">
                <ChevronRightIcon className="w-4 h-4 rotate-180" />
            </button>
            <h1 className="text-lg font-bold text-black tracking-tight">{title}</h1>
        </div>
        <div className="p-5">{children}</div>
    </div>
);

/* =========================================================================
   PROFILE PAGE — live data from your backend, fully editable, with a
   new mobile-number field, and the correct vehicle image for this captain.
   ========================================================================= */
const ProfilePage = ({ onBack, captain, loading, onSave, onLogout }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ firstname: "", lastname: "", mobile: "" });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (captain) {
            setForm({
                firstname: captain.fullname?.firstname || "",
                lastname: captain.fullname?.lastname || "",
                mobile: captain.mobile || "",
            });
        }
    }, [captain]);

    // Clean up the temporary object URL used for the live photo preview.
    useEffect(() => {
        return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); };
    }, [imagePreview]);

    const vehicleImg = vehicleImages[captain?.vehicle?.vehicleType] || carImg;
    const avatarSrc = imagePreview || resolveAvatar(captain);

    const handleChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const handlePickPhoto = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        setError("");
        setSaving(true);
        try {
            await onSave({
                firstname: form.firstname,
                lastname: form.lastname,
                mobile: form.mobile,
                imageFile,
            });
            setIsEditing(false);
            setImageFile(null);
        } catch (err) {
            setError(err?.response?.data?.message || "Could not save changes. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <PageShell title="My Profile" onBack={onBack}>
                <div className="animate-pulse space-y-4">
                    <div className="h-24 w-24 rounded-full bg-neutral-100 mx-auto" />
                    <div className="h-4 w-40 bg-neutral-100 rounded mx-auto" />
                    <div className="h-24 bg-neutral-100 rounded-2xl mt-6" />
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell title="My Profile" onBack={onBack}>
            <div className="flex flex-col items-center text-center py-4">
                <div className="relative">
                    <img src={avatarSrc} alt="Driver" className="w-24 h-24 rounded-full object-cover shadow-md" />
                    {isEditing && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 h-8 w-8 bg-black text-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all"
                            aria-label="Change photo"
                        >
                            <PencilIcon className="w-3.5 h-3.5" />
                        </button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePickPhoto} className="hidden" />
                </div>
                {!isEditing ? (
                    <>
                        <h2 className="text-xl font-bold text-black mt-4 tracking-tight">
                            {form.firstname} {form.lastname}
                        </h2>
                        <p className="text-sm text-neutral-400 font-medium mt-1">{captain?.email}</p>
                    </>
                ) : (
                    <div className="w-full mt-4 space-y-3 text-left">
                        <div>
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">First Name</label>
                            <input value={form.firstname} onChange={handleChange("firstname")} className="w-full mt-1 bg-neutral-50 rounded-xl px-4 py-3 text-sm font-semibold text-black outline-none focus:ring-2 focus:ring-black" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Last Name</label>
                            <input value={form.lastname} onChange={handleChange("lastname")} className="w-full mt-1 bg-neutral-50 rounded-xl px-4 py-3 text-sm font-semibold text-black outline-none focus:ring-2 focus:ring-black" />
                        </div>
                    </div>
                )}
                <div className="flex items-center gap-1.5 mt-3 text-sm font-semibold text-neutral-700">
                    <StarIcon className="w-4 h-4 fill-amber-400 text-amber-400" />
                    4.92 rating &bull; 3,214 trips
                </div>
            </div>

            {/* Mobile number — new field, saved to the database */}
            <div className="mt-5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Mobile Number</label>
                {isEditing ? (
                    <input
                        type="tel"
                        value={form.mobile}
                        onChange={handleChange("mobile")}
                        placeholder="e.g. 9876543210"
                        className="w-full mt-1 bg-neutral-50 rounded-xl px-4 py-3 text-sm font-semibold text-black outline-none focus:ring-2 focus:ring-black"
                    />
                ) : (
                    <p className="mt-1 bg-neutral-50 rounded-xl px-4 py-3 text-sm font-semibold text-black">
                        {form.mobile || "Not added yet"}
                    </p>
                )}
            </div>

            {error && <p className="text-xs text-red-500 font-medium mt-2">{error}</p>}

            <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                    { label: "Acceptance", value: "94%" },
                    { label: "Cancellation", value: "2%" },
                    { label: "Member Since", value: "2021" },
                ].map((s) => (
                    <div key={s.label} className="bg-neutral-50 rounded-2xl p-4 text-center">
                        <p className="text-lg font-black text-black">{s.value}</p>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Vehicle card — image swaps automatically by vehicleType */}
            <div className="mt-6 bg-neutral-50 rounded-2xl p-4 flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                    <img src={vehicleImg} alt={captain?.vehicle?.vehicleType || "vehicle"} className="h-12 w-12 object-contain" />
                </div>
                <div>
                    <p className="text-sm font-bold text-black capitalize">
                        {captain?.vehicle?.vehicleType || "Vehicle"} &bull; {captain?.vehicle?.color || "-"}
                    </p>
                    <p className="text-xs text-neutral-400 font-medium mt-0.5">
                        Plate: {captain?.vehicle?.plate || "-"} &bull; Seats {captain?.vehicle?.capacity || "-"}
                    </p>
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                {isEditing ? (
                    <>
                        <button onClick={() => setIsEditing(false)} className="flex-1 bg-neutral-100 text-black font-bold py-4 rounded-2xl text-sm active:scale-[0.98] transition-all">
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving} className="flex-1 bg-black text-white font-bold py-4 rounded-2xl text-sm active:scale-[0.98] transition-all disabled:opacity-60">
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="flex-1 bg-black text-white font-bold py-4 rounded-2xl text-sm active:scale-[0.98] transition-all flex justify-center items-center gap-2">
                        <PencilIcon className="w-4 h-4" />
                        Edit Profile
                    </button>
                )}
            </div>

            <button
                onClick={onLogout}
                className="w-full mt-3 flex items-center justify-center gap-2 text-red-500 font-bold py-4 rounded-2xl bg-neutral-50 text-sm active:scale-[0.98] transition-all"
            >
                <LogoutIcon className="w-4 h-4" />
                Log Out
            </button>
        </PageShell>
    );
};

/* =========================================================================
   EARNINGS PAGE
   ========================================================================= */
const EarningsPage = ({ onBack }) => {
    const week = [
        { day: "Mon", amount: 62 },
        { day: "Tue", amount: 78 },
        { day: "Wed", amount: 45 },
        { day: "Thu", amount: 91 },
        { day: "Fri", amount: 110 },
        { day: "Sat", amount: 134 },
        { day: "Sun", amount: 58 },
    ];
    const max = Math.max(...week.map((d) => d.amount));
    return (
        <PageShell title="Earnings" onBack={onBack}>
            <div className="bg-neutral-50 rounded-2xl p-5">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide">This Week</p>
                <p className="text-4xl font-black text-black tracking-tight mt-1">$578.00</p>
                <p className="text-xs text-neutral-400 font-medium mt-1">32 trips &bull; 41.5 hrs online</p>
            </div>
            <div className="flex items-end justify-between gap-2 mt-6 h-32 px-1">
                {week.map((d) => (
                    <div key={d.day} className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-full max-w-[26px] bg-black rounded-full" style={{ height: `${(d.amount / max) * 100}%` }} />
                        <span className="text-[10px] font-bold text-neutral-400">{d.day}</span>
                    </div>
                ))}
            </div>
            <div className="mt-6 space-y-2.5">
                {[
                    { label: "Trip Fares", value: "$498.20" },
                    { label: "Tips", value: "$52.30" },
                    { label: "Promotions", value: "$27.50" },
                ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between bg-neutral-50 rounded-2xl px-4 py-3.5">
                        <span className="text-sm font-medium text-neutral-600">{r.label}</span>
                        <span className="text-sm font-bold text-black">{r.value}</span>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 bg-black text-white font-bold py-4 rounded-2xl text-sm active:scale-[0.98] transition-all">Cash Out</button>
        </PageShell>
    );
};

/* =========================================================================
   RIDE HISTORY PAGE
   ========================================================================= */
const HistoryPage = ({ onBack }) => {
    const trips = [
        { name: "Esther Berry", date: "Today, 2:40 PM", fare: "$25.00", status: "Completed" },
        { name: "Daniel Cole", date: "Today, 11:05 AM", fare: "$14.50", status: "Completed" },
        { name: "Priya Nair", date: "Yesterday, 8:12 PM", fare: "$32.75", status: "Completed" },
        { name: "Marcus Lee", date: "Yesterday, 6:03 PM", fare: "$9.00", status: "Cancelled" },
    ];
    return (
        <PageShell title="Ride History" onBack={onBack}>
            <div className="space-y-3">
                {trips.map((t, i) => (
                    <div key={i} className="bg-neutral-50 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-black">{t.name}</p>
                            <p className="text-xs text-neutral-400 font-medium mt-1">{t.date}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-black">{t.fare}</p>
                            <span className={`text-[10px] font-bold uppercase tracking-wide mt-1 inline-block ${t.status === "Completed" ? "text-emerald-600" : "text-neutral-400"}`}>{t.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </PageShell>
    );
};

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */
const CaptainHome = () => {
    const navigate = useNavigate();

    // --- UI-flow state ---
    const [isOnline, setIsOnline] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState("home");
    const [isExpanded, setIsExpanded] = useState(false);

    // --- Live captain profile, fetched from your real backend ---
    const [captain, setCaptain] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);

    // --- Ride requests: now an array, so several can float in at once ---
    const [rideRequests, setRideRequests] = useState(MOCK_REQUESTS);
    const [acceptedRide, setAcceptedRide] = useState(null);

    // --- Live navigation tracking, shown as the bottom bar after "Navigate" ---
    // navPhase: null (not navigating) -> "pickup" (heading to passenger) -> "dropoff" (heading to destination)
    const [navPhase, setNavPhase] = useState(null);
    const [liveSpeed, setLiveSpeed] = useState(0);
    const [liveDistanceKm, setLiveDistanceKm] = useState(0);
    const [completedRidesToday, setCompletedRidesToday] = useState(4); // mock: 4 rides already done today
    const [todaysEarnings, setTodaysEarnings] = useState(186.4); // mock running total

    // Simulate live speed/distance while a navigation phase is active.
    // Swap this out for real GPS telemetry when that's wired up.
    useEffect(() => {
        if (!navPhase) return;
        const speedTimer = setInterval(() => {
            setLiveSpeed(24 + Math.round(Math.random() * 28)); // 24-52 km/h
        }, 2000);
        const distanceTimer = setInterval(() => {
            setLiveDistanceKm((d) => Math.max(0, +(d - 0.1).toFixed(1)));
        }, 3000);
        return () => { clearInterval(speedTimer); clearInterval(distanceTimer); };
    }, [navPhase]);

    useEffect(() => {
        let mounted = true;
        api
            .get("/captains/profile")
            // Per the API docs, GET /captains/profile returns the captain object directly (no wrapper).
            .then((res) => { if (mounted) setCaptain(res.data); })
            .catch((err) => console.error("Failed to load captain profile:", err))
            .finally(() => { if (mounted) setProfileLoading(false); });
        return () => { mounted = false; };
    }, []);

    const handleLogout = async () => {
        try {
            await api.get("/captains/logout");
        } catch (err) {
            console.error("Logout request failed:", err);
        } finally {
            localStorage.removeItem("token");
            navigate("/CaptainLogin");
        }
    };

    // Requires the new PUT /captains/update-profile route (multer + controller) — see the backend files shared alongside this component.
    // `updates` = { firstname, lastname, mobile, imageFile } — imageFile is optional (a File object from <input type="file">).
    const handleUpdateProfile = async ({ firstname, lastname, mobile, imageFile }) => {
        const formData = new FormData();
        formData.append("fullname[firstname]", firstname);
        formData.append("fullname[lastname]", lastname);
        formData.append("mobile", mobile);
        if (imageFile) formData.append("profileImage", imageFile);

        const res = await api.put("/captains/update-profile", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setCaptain(res.data);
        return res.data;
    };

    const handleDecline = (id) => {
        setRideRequests((prev) => prev.filter((r) => r.id !== id));
        setIsExpanded(false);
    };

    const handleAccept = (request) => {
        setRideRequests((prev) => prev.filter((r) => r.id !== request.id));
        setIsExpanded(false);
        setAcceptedRide(request);
    };

    // Fires when "Navigate" is tapped on the full trip-detail page — swaps
    // that page out for the bottom tracking bar, phase "pickup".
    const handleStartNavigation = () => {
        setLiveSpeed(24 + Math.round(Math.random() * 28));
        setLiveDistanceKm(parseFloat(acceptedRide?.distance) || 0);
        setNavPhase("pickup");
    };

    const handlePickedPassenger = () => {
        setLiveSpeed(24 + Math.round(Math.random() * 28));
        setLiveDistanceKm(parseFloat(acceptedRide?.tripDistance) || 0);
        setNavPhase("dropoff");
    };

    const handleCancelRide = () => {
        setNavPhase(null);
        setAcceptedRide(null);
    };

    const handleCompleteRide = () => {
        const fareValue = parseFloat(String(acceptedRide?.fare).replace(/[^0-9.]/g, "")) || 0;
        setTodaysEarnings((prev) => +(prev + fareValue).toFixed(2));
        setCompletedRidesToday((prev) => prev + 1);
        setNavPhase(null);
        setAcceptedRide(null);
    };

    const goHome = () => setActiveMenu("home");

    return (
        <>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                activeMenu={activeMenu}
                onNavigate={(page) => { setActiveMenu(page); setIsSidebarOpen(false); }}
                captain={captain}
                onLogout={handleLogout}
            />

            {activeMenu === "profile" && (
                <ProfilePage onBack={goHome} captain={captain} loading={profileLoading} onSave={handleUpdateProfile} onLogout={handleLogout} />
            )}
            {activeMenu === "earnings" && <EarningsPage onBack={goHome} />}
            {activeMenu === "history" && <HistoryPage onBack={goHome} />}

            {activeMenu === "home" && (
                <div className="h-screen w-screen relative overflow-hidden bg-white font-sans antialiased select-none text-black">
                    <Header
                        onMenuClick={() => setIsSidebarOpen(true)}
                        isOnline={isOnline}
                        onToggleOnline={() => setIsOnline(!isOnline)}
                    />

                    <div className="absolute inset-0 h-full w-full z-0 bg-neutral-200">
                        <img
                            src={mapImg}
                            alt="Map"
                            className="w-full h-full object-cover transition-all duration-500"
                            style={{ filter: isOnline ? "none" : "brightness(0.75) grayscale(0.7)" }}
                        />
                        {!isOnline && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/45 z-10">
                                <div className="bg-white text-black font-medium text-sm px-6 py-4 rounded-2xl shadow-xl text-center max-w-xs mx-4">
                                    <p className="text-base font-bold mb-1">You're offline</p>
                                    <p className="text-xs text-neutral-500">Go online to start receiving ride requests nearby.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {acceptedRide && !navPhase && (
                        <AcceptedRideDetails ride={acceptedRide} onCancel={() => setAcceptedRide(null)} onNavigate={handleStartNavigation} />
                    )}

                    {acceptedRide && navPhase && (
                        <NavigationBar
                            phase={navPhase}
                            ride={acceptedRide}
                            speed={liveSpeed}
                            distanceKm={liveDistanceKm}
                            rideNumberToday={completedRidesToday + 1}
                            todaysEarnings={`$${todaysEarnings.toFixed(2)}`}
                            onPickedPassenger={handlePickedPassenger}
                            onCancelRide={handleCancelRide}
                            onCompleteRide={handleCompleteRide}
                        />
                    )}

                    {!acceptedRide && isOnline && rideRequests.length > 0 && (
                        <RequestStack
                            requests={rideRequests}
                            isExpanded={isExpanded}
                            setIsExpanded={setIsExpanded}
                            onAccept={handleAccept}
                            onDecline={handleDecline}
                        />
                    )}

                    <style>{`
                        @keyframes popUp {
                            from { transform: translateY(60px); opacity: 0; }
                            to { transform: translateY(0); opacity: 1; }
                        }
                    `}</style>
                </div>
            )}
        </>
    );
};

export default CaptainHome;