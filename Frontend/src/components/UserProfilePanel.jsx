import { useState, useRef } from "react";
import axios from "axios";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200";

const UserProfilePanel = ({ user, token, onClose, onProfileUpdated, onLogout }) => {
    const [firstname, setFirstname] = useState(user?.fullname?.firstname || "");
    const [lastname, setLastname] = useState(user?.fullname?.lastname || "");
    const [mobile, setMobile] = useState(user?.mobile || "");
    const [previewUrl, setPreviewUrl] = useState(
        user?._id ? `${import.meta.env.VITE_BASE_URL}/users/photo/${user._id}?t=${Date.now()}` : DEFAULT_AVATAR
    );
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMsg("");

        try {
            const formData = new FormData();
            formData.append("firstname", firstname);
            formData.append("lastname", lastname);
            formData.append("mobile", mobile);
            if (selectedFile) {
                formData.append("profileImage", selectedFile);
            }

            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/users/update-profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data) {
                onProfileUpdated(response.data);
                onClose();
            }
        } catch (err) {
            console.error(err);
            setErrorMsg(err.response?.data?.message || "Profile update fail ho gaya. Kripya fir se koshish karein.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="absolute inset-0 bg-white z-50 flex flex-col animate-[popUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
            {/* Header */}
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <button type="button" onClick={onClose} className="p-1 active:scale-90 transition-transform">
                    <svg className="w-6 h-6 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-xl font-bold text-neutral-900">Your Profile</h2>
                <div className="w-8" />
            </div>

            {/* Main content view */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">

                {/* Photo Upload Section */}
                <div className="flex flex-col items-center justify-center gap-3">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative w-28 h-28 rounded-full border-4 border-neutral-100 shadow-md overflow-hidden cursor-pointer group active:scale-95 transition-transform"
                    >
                        <img
                            src={previewUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <span className="text-xs text-neutral-500 font-medium">Badalne ke liye photo par tap karein</span>
                </div>

                {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium">
                        {errorMsg}
                    </div>
                )}

                {/* Form fields */}
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">First Name</label>
                        <input
                            type="text"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                            placeholder="John"
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-800 focus:outline-none focus:border-black transition-colors text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Last Name</label>
                        <input
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            placeholder="Doe"
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-800 focus:outline-none focus:border-black transition-colors text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="w-full bg-neutral-100 border border-neutral-200 text-neutral-400 rounded-xl px-4 py-3 cursor-not-allowed text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1">Mobile Number</label>
                        <input
                            type="tel"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="Mobile number add karein"
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-800 focus:outline-none focus:border-black transition-colors text-base"
                        />
                    </div>
                </div>

                {/* Actions setup area */}
                <div className="mt-auto pt-6 flex flex-col gap-3">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full bg-black hover:bg-neutral-950 text-white rounded-xl py-3.5 font-bold active:scale-[0.98] transition-all disabled:bg-neutral-400 text-base"
                    >
                        {isSaving ? "Updation Under Process..." : "Save Profile"}
                    </button>

                    <button
                        type="button"
                        onClick={onLogout}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 rounded-xl py-3.5 font-bold active:scale-[0.98] transition-all border border-red-200 text-base"
                    >
                        Log Out
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserProfilePanel;