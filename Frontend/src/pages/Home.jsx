import React from 'react';
import { Link } from 'react-router-dom';

import uberLogo from '../assets/images/uber-logo.png';
import uberHome from '../assets/images/ubar-home.jpg';

const Home = () => {
    return (
        <div className="relative h-screen w-full overflow-hidden">

            {/* Background Image */}
            <img
                src={uberHome}
                alt="Uber Background"
                className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Logo */}
            <div className="absolute top-5 left-5 z-20">
                <img
                    src={uberLogo}
                    alt="Uber Logo"
                    className="w-20"
                />
            </div>

            {/* Bottom Card */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-3xl px-7 py-8 shadow-2xl">

                <h1 className="text-[27px] font-bold text-gray-900 leading-tight">
                    Get started with Uber
                </h1>

                <p className="mt-2 text-[15px] text-gray-500 leading-6">
                    Request a ride anywhere, anytime with just a few taps.
                </p>

                <Link
                    to="/UserLogin"
                    className="
                        mt-7
                        flex
                        items-center
                        justify-center
                        gap-3
                        w-full
                        bg-black
                        text-white
                        py-4
                        rounded-xl
                        text-[17px]
                        font-semibold
                        transition-all
                        duration-300
                        hover:bg-neutral-900
                        hover:shadow-xl
                        active:scale-95
                    "
                >
                    Continue

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 5l7 7-7 7M5 12h15"
                        />
                    </svg>
                </Link>

            </div>

        </div>
    );
};

export default Home;