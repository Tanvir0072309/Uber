import { useState } from "react";
import { Link } from "react-router-dom";
import uberLogo from "../assets/images/uber-logo.png";

const UserLogin = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();

        setEmailError("");
        setPasswordError("");

        let isValid = true;

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setEmailError("Email is required.");
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setEmailError("Please enter a valid email address.");
            isValid = false;
        }

        if (!password) {
            setPasswordError("Password is required.");
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
            isValid = false;
        }

        if (!isValid) return;

        // API Call will come here
        console.log({
            email: trimmedEmail,
            password,
        });

        setEmail("");
        setPassword("");
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-between">

            {/* Top Section */}
            <div>

                {/* Logo */}
                <div className="px-6 pt-5">
                    <img
                        src={uberLogo}
                        alt="Uber Logo"
                        className="w-20"
                    />
                </div>

                {/* Form */}
                <form
                    onSubmit={submitHandler}
                    className="px-6 mt-8"
                    noValidate
                >

                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome Back 👋
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Login to continue your journey.
                    </p>

                    {/* Email */}

                    <div className="mt-8">

                        <label className="block mb-2 text-sm font-semibold">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="user@email.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailError) setEmailError("");
                            }}
                            className={`w-full rounded-2xl px-5 py-4 outline-none transition border ${emailError
                                ? "border-red-500 bg-red-50"
                                : "border-gray-200 bg-gray-100 focus:bg-white focus:border-black"
                                }`}
                        />

                        {emailError && (
                            <p className="mt-2 text-sm text-red-500">
                                {emailError}
                            </p>
                        )}

                    </div>

                    {/* Password */}

                    <div className="mt-5">

                        <label className="block mb-2 text-sm font-semibold">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (passwordError) setPasswordError("");
                            }}
                            className={`w-full rounded-2xl px-5 py-4 outline-none transition border ${passwordError
                                ? "border-red-500 bg-red-50"
                                : "border-gray-200 bg-gray-100 focus:bg-white focus:border-black"
                                }`}
                        />

                        {passwordError && (
                            <p className="mt-2 text-sm text-red-500">
                                {passwordError}
                            </p>
                        )}

                    </div>

                    {/* Login Button */}

                    <button
                        type="submit"
                        className="
                            mt-7
                            w-full
                            rounded-2xl
                            bg-black
                            py-4
                            text-lg
                            font-semibold
                            text-white
                            transition-all
                            duration-300
                            hover:bg-neutral-900
                            active:scale-95
                        "
                    >
                        Login as User
                    </button>

                </form>

                {/* Sign Up */}

                <div className="mt-6 flex items-center justify-center gap-3">

                    <span className="text-sm text-gray-600">
                        New to Uber?
                    </span>

                    <Link
                        to="/UserSignup"
                        className="
                            rounded-lg
                            border
                            border-black
                            px-5
                            py-2
                            text-sm
                            font-semibold
                            transition-all
                            duration-300
                            hover:bg-black
                            hover:text-white
                        "
                    >
                        Sign Up
                    </Link>

                </div>

            </div>

            {/* Captain Button */}

            <div className="px-6 pb-6">

                <Link
                    to="/CaptainLogin"
                    className="
                        flex
                        h-14
                        w-full
                        items-center
                        justify-center
                        rounded-2xl
                        bg-zinc-900
                        text-lg
                        font-semibold
                        text-white
                        transition-all
                        duration-300
                        hover:bg-black
                        active:scale-95
                    "
                >
                    Sign Up as a Captain
                </Link>

            </div>

        </div>
    );
};

export default UserLogin;