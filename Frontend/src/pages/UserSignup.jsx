import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import uberLogo from "../assets/images/uber-logo.png";
import axios from 'axios';
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const UserSignup = () => {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const { user, setUser } = useContext(UserContext);
    const [errors, setErrors] = useState({});

    const submitHandler = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (firstname.trim().length < 3) {
            newErrors.firstname = "First name must be at least 3 characters.";
        }

        if (lastname && lastname.trim().length < 3) {
            newErrors.lastname = "Last name must be at least 3 characters.";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            newErrors.email = "Please enter a valid email.";
        }

        if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) return;

        const newUser = {
            fullname: {
                firstname: firstname.trim(),
                lastname: lastname.trim()
            },
            email: email.trim(),
            password
        };

        

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

        if (response.status === 201) {
            const data = response.data;
            localStorage.setItem("token", data.token);
            setUser(data.user)
            navigate('/Home')
        }

        // Reset
        setFirstname("");
        setLastname("");
        setEmail("");
        setPassword("");
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-between pb-8">
            {/* Top Content Area */}
            <div>
                {/* Logo */}
                <div className="px-6 pt-6">
                    <img
                        src={uberLogo}
                        alt="Uber"
                        className="w-20"
                    />
                </div>

                {/* Form Elements */}
                <form onSubmit={submitHandler} className="px-6 mt-8" noValidate>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
                        Create Account
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Create your Uber account to start riding.
                    </p>

                    {/* Name Fields in a 2-Column Grid */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-neutral-800">
                                First Name
                            </label>
                            <input
                                type="text"
                                placeholder="John"
                                value={firstname}
                                onChange={(e) => {
                                    setFirstname(e.target.value);
                                    setErrors({ ...errors, firstname: "" });
                                }}
                                className={`w-full rounded-2xl px-5 py-4 border outline-none transition-all duration-200 ${errors.firstname
                                    ? "border-red-500 bg-red-50 focus:bg-red-50"
                                    : "border-gray-200 bg-gray-100 focus:border-black focus:bg-white"
                                    }`}
                            />
                            {errors.firstname && (
                                <p className="mt-1.5 text-xs text-red-500 font-medium">
                                    {errors.firstname}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-neutral-800">
                                Last Name
                            </label>
                            <input
                                type="text"
                                placeholder="Doe"
                                value={lastname}
                                onChange={(e) => {
                                    setLastname(e.target.value);
                                    setErrors({ ...errors, lastname: "" });
                                }}
                                className={`w-full rounded-2xl px-5 py-4 border outline-none transition-all duration-200 ${errors.lastname
                                    ? "border-red-500 bg-red-50 focus:bg-red-50"
                                    : "border-gray-200 bg-gray-100 focus:border-black focus:bg-white"
                                    }`}
                            />
                            {errors.lastname && (
                                <p className="mt-1.5 text-xs text-red-500 font-medium">
                                    {errors.lastname}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mt-5">
                        <label className="block mb-2 text-sm font-semibold text-neutral-800">
                            Email address
                        </label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors({ ...errors, email: "" });
                            }}
                            className={`w-full rounded-2xl px-5 py-4 border outline-none transition-all duration-200 ${errors.email
                                ? "border-red-500 bg-red-50 focus:bg-red-50"
                                : "border-gray-200 bg-gray-100 focus:border-black focus:bg-white"
                                }`}
                        />
                        {errors.email && (
                            <p className="mt-1.5 text-xs text-red-500 font-medium">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="mt-5">
                        <label className="block mb-2 text-sm font-semibold text-neutral-800">
                            Enter Password
                        </label>
                        <input
                            type="password"
                            placeholder="Min. 6 characters"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors({ ...errors, password: "" });
                            }}
                            className={`w-full rounded-2xl px-5 py-4 border outline-none transition-all duration-200 ${errors.password
                                ? "border-red-500 bg-red-50 focus:bg-red-50"
                                : "border-gray-200 bg-gray-100 focus:border-black focus:bg-white"
                                }`}
                        />
                        {errors.password && (
                            <p className="mt-1.5 text-xs text-red-500 font-medium">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Black Action Button */}
                    <button
                        type="submit"
                        className="mt-8 w-full rounded-2xl bg-black py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-neutral-800 active:scale-[0.99]"
                    >
                        Create Account
                    </button>
                </form>
            </div>

            {/* Bottom Footer Area */}
            <div className="px-6 mt-6">
                <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/UserLogin" className="text-blue-600 font-semibold hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default UserSignup;