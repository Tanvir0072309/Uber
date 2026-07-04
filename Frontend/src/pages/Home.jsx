import React from "react";
import uberLogo from "../assets/images/uber-logo.png";

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100">

            {/* Header */}

            <div className="bg-white shadow-sm px-6 py-5 flex justify-between items-center">

                <img
                    src={uberLogo}
                    alt="Uber Logo"
                    className="w-20"
                />

                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                    T
                </div>

            </div>

            {/* Search Section */}

            <div className="bg-white mt-3 rounded-t-3xl px-6 py-6">

                <h1 className="text-3xl font-bold">
                    Good Evening 👋
                </h1>

                <p className="text-gray-500 mt-1">
                    Where are you going today?
                </p>

                <input
                    type="text"
                    placeholder="Search destination"
                    className="mt-6 w-full bg-gray-100 rounded-2xl px-5 py-4 outline-none border border-gray-200 focus:border-black"
                />

            </div>

            {/* Current Location */}

            <div className="px-6 mt-6">

                <div className="bg-white rounded-2xl p-5 shadow-sm">

                    <h3 className="font-semibold text-lg">
                        Current Location
                    </h3>

                    <p className="text-gray-500 mt-2">
                        Tap to detect your current location
                    </p>

                </div>

            </div>

            {/* Recent Places */}

            <div className="px-6 mt-6">

                <h2 className="font-bold text-xl mb-4">
                    Recent Places
                </h2>

                <div className="space-y-4">

                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        🏠 Home
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        🏢 Office
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        📍 Railway Station
                    </div>

                </div>

            </div>

            {/* Ride Types */}

            <div className="px-6 mt-8 pb-8">

                <h2 className="font-bold text-xl mb-4">
                    Choose Your Ride
                </h2>

                <div className="grid grid-cols-3 gap-4">

                    <div className="bg-white rounded-2xl p-4 text-center shadow-sm cursor-pointer hover:shadow-md duration-300">
                        🚗
                        <p className="mt-2 font-semibold">
                            Uber Go
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 text-center shadow-sm cursor-pointer hover:shadow-md duration-300">
                        🚙
                        <p className="mt-2 font-semibold">
                            Premier
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 text-center shadow-sm cursor-pointer hover:shadow-md duration-300">
                        🛺
                        <p className="mt-2 font-semibold">
                            Auto
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Home;