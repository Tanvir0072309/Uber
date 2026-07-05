import carImg from "../assets/images/vehicles/car.png";
import bikeImg from "../assets/images/vehicles/bike.png";
import autoImg from "../assets/images/vehicles/auto.png";

const PersonIcon = ({ className = "w-3 h-3" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
);

export const vehiclesData = [
    {
        id: "uber-go",
        name: "UberGo",
        img: carImg,
        capacity: 4,
        time: "2 mins away",
        desc: "Affordable, compact rides",
        price: "₹155.20",
        driver: {
            name: "Rajesh Kumar",
            phone: "+919876543210",
            rating: 4.92,
            plate: "GJ 01 AB 4521",
            model: "Swift Dzire · White",
        },
    },
    {
        id: "moto",
        name: "Moto",
        img: bikeImg,
        capacity: 1,
        time: "3 mins away",
        desc: "Affordable motorcycle rides",
        price: "₹55.17",
        driver: {
            name: "Amit Shah",
            phone: "+919123456789",
            rating: 4.88,
            plate: "GJ 05 CD 8899",
            model: "Hero Splendor · Black",
        },
    },
    {
        id: "uber-auto",
        name: "UberAuto",
        img: autoImg,
        capacity: 3,
        time: "1 min away",
        desc: "Doorstep auto rides",
        price: "₹118.21",
        driver: {
            name: "Vikram Patel",
            phone: "+919998887766",
            rating: 4.95,
            plate: "GJ 27 EF 3344",
            model: "Bajaj RE · Yellow-Green",
        },
    },
];

const VehicleSelectionPanel = ({ pickup, destination, onSelect, onBack }) => {
    return (
        <div className="flex flex-col h-full min-h-0 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4 shrink-0">
                <button
                    type="button"
                    onClick={onBack}
                    className="h-9 w-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 active:scale-95 transition-all shrink-0"
                    aria-label="Go back"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-neutral-900 tracking-tight truncate">Choose a ride</h2>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                        {pickup} → {destination}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-3 shrink-0">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Suggested options</h3>
                <span className="text-[10px] text-neutral-500 font-semibold bg-neutral-100 px-2.5 py-1 rounded-full">
                    Sorted by ETA
                </span>
            </div>

            <div className="flex flex-col gap-2.5 flex-1 min-h-0 overflow-y-auto no-scrollbar pb-1">
                {vehiclesData.map((vehicle) => (
                    <button
                        key={vehicle.id}
                        type="button"
                        onClick={() => onSelect(vehicle)}
                        className="flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-900 border border-neutral-100 hover:border-neutral-900 rounded-2xl transition-all duration-200 group text-left w-full active:scale-[0.99] shrink-0"
                    >
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-16 h-12 flex items-center justify-center bg-white rounded-xl border border-neutral-100 shadow-sm p-1 shrink-0 group-hover:bg-neutral-800 transition-colors">
                                <img src={vehicle.img} alt={vehicle.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-neutral-900 group-hover:text-white text-sm tracking-tight transition-colors">
                                        {vehicle.name}
                                    </p>
                                    <span className="inline-flex items-center gap-0.5 text-[10px] bg-neutral-200/70 group-hover:bg-neutral-800 px-1.5 py-0.5 rounded font-bold text-neutral-600 group-hover:text-neutral-300 transition-all">
                                        <PersonIcon />
                                        {vehicle.capacity}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <p className="text-xs font-semibold text-emerald-600 group-hover:text-emerald-400 transition-colors">
                                        {vehicle.time}
                                    </p>
                                    <span className="text-neutral-300 group-hover:text-neutral-600">·</span>
                                    <p className="text-xs text-neutral-400 group-hover:text-neutral-300 truncate transition-colors">
                                        {vehicle.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="text-base font-extrabold text-neutral-900 group-hover:text-white tracking-tight transition-colors ml-3 shrink-0">
                            {vehicle.price}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default VehicleSelectionPanel;
