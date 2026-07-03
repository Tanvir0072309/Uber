import { useState } from "react";
import { Link } from "react-router-dom";
import uberLogo from "../assets/images/uber-logo.png";
import autoImg from "../assets/images/vehicles/auto.png";
import bikeImg from "../assets/images/vehicles/bike.png";
import carImg from "../assets/images/vehicles/car.png";

const CaptainSignup = () => {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [color, setColor] = useState("");
    const [plate, setPlate] = useState("");
    const [capacity, setCapacity] = useState("");
    const [vehicleType, setVehicleType] = useState("");

    const [errors, setErrors] = useState({});

    const submitHandler = (e) => {
        e.preventDefault();

        const newErrors = {};

        // Name Validation
        if (firstname.trim().length < 3) {
            newErrors.firstname = "First name must be at least 3 characters.";
        }
        if (lastname && lastname.trim().length < 3) {
            newErrors.lastname = "Last name must be at least 3 characters.";
        }

        // Email Validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            newErrors.email = "Please enter a valid email.";
        }

        // Password Validation
        if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        // Vehicle Color Validation
        if (!color.trim()) {
            newErrors.color = "Vehicle color is required.";
        }

        // Number Plate Validation (Strict check for both letters and numbers)
        const plateRegex = /^(?=.*[A-Z])(?=.*\d)[A-Z0-9\s-]+$/;
        if (!plate.trim()) {
            newErrors.plate = "Plate number is required.";
        } else if (!plateRegex.test(plate)) {
            newErrors.plate = "Plate number must contain both letters and numbers (e.g., MH12AB1234).";
        }

        // Vehicle Type Check
        if (!vehicleType) {
            newErrors.vehicleType = "Please select a vehicle type.";
        }

        // Dynamic Capacity Validation
        const capNum = Number(capacity);
        if (!capacity) {
            newErrors.capacity = "Capacity is required.";
        } else if (capNum <= 0) {
            newErrors.capacity = "Capacity must be greater than 0.";
        } else if (vehicleType) {
            if (vehicleType === "motorcycle" && capNum > 2) {
                newErrors.capacity = "Bike cannot have a capacity of more than 2.";
            } else if (vehicleType === "car" && capNum > 4) {
                newErrors.capacity = "Car cannot have a capacity of more than 4.";
            } else if (vehicleType === "auto" && capNum > 5) {
                newErrors.capacity = "Auto/Riksha cannot have a capacity of more than 5.";
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) return;

        // Final Object
        const newCaptain = {
            fullname: {
                firstname: firstname.trim(),
                lastname: lastname.trim()
            },
            email: email.trim(),
            password,
            vehicle: {
                color: color.trim(),
                plate: plate.trim(), // Yeh automatic capital hi save hoga
                capacity: Number(capacity),
                vehicleType
            }
        };

        console.log(newCaptain);

        // Reset Form
        setFirstname("");
        setLastname("");
        setEmail("");
        setPassword("");
        setColor("");
        setPlate("");
        setCapacity("");
        setVehicleType("");
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-between pb-10">
            <div>
                {/* Logo */}
                <div className="px-6 pt-5">
                    <img src={uberLogo} alt="Uber Logo" className="w-20" />
                </div>

                {/* Form */}
                <form onSubmit={submitHandler} className="px-6 mt-8" noValidate>
                    <h1 className="text-3xl font-bold">Captain Sign Up</h1>
                    <p className="mt-1 text-sm text-gray-500">Create your captain account.</p>

                    {/* Name Fields (Grid) */}
                    <div className="grid grid-cols-2 gap-4 mt-7">
                        <div>
                            <label className="block mb-2 text-sm font-semibold">First Name</label>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                className="w-full rounded-2xl bg-gray-100 border border-gray-200 px-5 py-4 outline-none focus:border-black focus:bg-white"
                            />
                            {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold">Last Name</label>
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                className="w-full rounded-2xl bg-gray-100 border border-gray-200 px-5 py-4 outline-none focus:border-black focus:bg-white"
                            />
                            {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mt-5">
                        <label className="block mb-2 text-sm font-semibold">Email</label>
                        <input
                            type="email"
                            placeholder="captain@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-2xl bg-gray-100 border border-gray-200 px-5 py-4 outline-none focus:border-black focus:bg-white"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="mt-5">
                        <label className="block mb-2 text-sm font-semibold">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-2xl bg-gray-100 border border-gray-200 px-5 py-4 outline-none focus:border-black focus:bg-white"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <h2 className="mt-8 text-xl font-bold">Vehicle Information</h2>

                    {/* Vehicle Type Selection */}
                    <div className="mt-5">
                        <label className="block mb-3 text-sm font-semibold">Select Vehicle Type</label>
                        <div className="grid grid-cols-3 gap-4">
                            {/* Car */}
                            <button
                                type="button"
                                onClick={() => setVehicleType("car")}
                                className={`rounded-2xl border-2 p-4 transition-all duration-300 ${vehicleType === "car" ? "border-black bg-gray-100 shadow-lg scale-105" : "border-gray-200 hover:border-black"
                                    }`}
                            >
                                <img src={carImg} alt="Car" className="mx-auto h-14 object-contain" />
                                <p className="mt-3 text-sm font-semibold text-center">Car</p>
                            </button>

                            {/* Bike */}
                            <button
                                type="button"
                                onClick={() => setVehicleType("motorcycle")}
                                className={`rounded-2xl border-2 p-4 transition-all duration-300 ${vehicleType === "motorcycle" ? "border-black bg-gray-100 shadow-lg scale-105" : "border-gray-200 hover:border-black"
                                    }`}
                            >
                                <img src={bikeImg} alt="Bike" className="mx-auto h-14 object-contain" />
                                <p className="mt-3 text-sm font-semibold text-center">Bike</p>
                            </button>

                            {/* Auto */}
                            <button
                                type="button"
                                onClick={() => setVehicleType("auto")}
                                className={`rounded-2xl border-2 p-4 transition-all duration-300 ${vehicleType === "auto" ? "border-black bg-gray-100 shadow-lg scale-105" : "border-gray-200 hover:border-black"
                                    }`}
                            >
                                <img src={autoImg} alt="Auto" className="mx-auto h-14 object-contain" />
                                <p className="mt-3 text-sm font-semibold text-center">Auto</p>
                            </button>
                        </div>
                        {errors.vehicleType && <p className="text-red-500 text-xs mt-1">{errors.vehicleType}</p>}
                    </div>

                    {/* Vehicle Color & Plate Number (Grid) */}
                    <div className="grid grid-cols-2 gap-4 mt-5">
                        <div>
                            <label className="block mb-2 text-sm font-semibold">Vehicle Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="White"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="flex-1 rounded-2xl bg-gray-100 border border-gray-200 px-5 py-4 outline-none focus:border-black focus:bg-white"
                                />
                                <div className="w-14 h-14 rounded-2xl border-2 border-gray-300 shadow-sm flex items-center justify-center bg-white">
                                    <div
                                        className="w-8 h-8 rounded-full border"
                                        style={{ backgroundColor: color || "transparent" }}
                                    />
                                </div>
                            </div>
                            {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color}</p>}
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold">Plate Number</label>
                            <input
                                type="text"
                                placeholder="MH12AB1234"
                                value={plate}
                                // SIRF ISME UPPERCASE RAHEGA
                                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                                style={{
                                    backgroundColor: color || "#ffffff",
                                    color: "#000000"
                                }}
                                className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none focus:border-black transition-colors duration-300"
                            />
                            {errors.plate && <p className="text-red-500 text-xs mt-1">{errors.plate}</p>}
                        </div>
                    </div>

                    {/* Seating Capacity */}
                    <div className="mt-5">
                        <label className="block mb-1 text-sm font-semibold">Seating Capacity</label>
                        <p className="text-xs text-gray-400 mb-2 font-medium">
                            *Max Allowed Limits — Bike: 2 | Car: 4 | Auto: 5
                        </p>
                        <input
                            type="number"
                            placeholder="4"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            className="w-full rounded-2xl bg-gray-100 border border-gray-200 px-5 py-4 outline-none focus:border-black focus:bg-white"
                        />
                        {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
                    </div>

                    {/* Submit Button (Black Background) */}
                    <button
                        type="submit"
                        className="w-full bg-black text-white font-bold py-4 rounded-2xl mt-8 hover:bg-gray-800 transition-colors"
                    >
                        Sign Up as Captain
                    </button>
                </form>

                {/* Footer Link */}
                <p className="text-center mt-6 text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/CaptainLogin" className="text-blue-600 font-medium hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default CaptainSignup;