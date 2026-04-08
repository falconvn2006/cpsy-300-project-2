"use client";
import { useState } from "react";
import { auth, googleProvider, githubProvider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";

export default function OAuthSection() {
    const [user, setUser] = useState(null);
    const [twoFACode, setTwoFACode] = useState(0);

const [loading, setLoading] = useState(false);

const handleLogin = async (provider) => {
    if (loading) return;

    setLoading(true);
    try {
        const result = await signInWithPopup(auth, provider);
        setUser(result.user);
    } catch (err) {
        if (err.code !== "auth/cancelled-popup-request") {
            console.error("Login failed:", err);
        }
    }
    setLoading(false);
};

    const handleLogout = async () => {
        await signOut(auth);
        setUser(null);
    };

    const handle2FA = (code) => {
        setTwoFACode(code);
    };

    return (
        <section>
            <p className="text-3xl font-bold mb-3">OAuth & 2FA Integration</p>
            <div className="flex flex-col gap-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200">

                {user ? (
                    <div>
                        <p className="text-[18px] font-bold mb-2">Welcome, {user.displayName}!</p>
                        <p className="text-gray-500 mb-4">{user.email}</p>
                        <button onClick={handleLogout}
                            className="text-[18px] bg-red-600 text-white p-3 rounded hover:cursor-pointer hover:bg-red-700">
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <div>
                        <p className="text-[18px] font-bold mb-2">Secure Login</p>
                        <div className="flex gap-2">
                            <button onClick={() => handleLogin(googleProvider)}
                                className="text-[18px] bg-blue-600 text-white p-3 rounded hover:cursor-pointer hover:bg-blue-700">
                                Login With Google
                            </button>
                            <button onClick={() => handleLogin(githubProvider)}
                                className="text-[18px] bg-blue-600 text-white p-3 rounded hover:cursor-pointer hover:bg-blue-700">
                                Login With GitHub
                            </button>
                        </div>
                    </div>
                )}

                <div className="w-full">
                    <p>Enter 2FA Code</p>
                    <input type="text" placeholder="Enter your 2FA code"
                        onChange={(e) => handle2FA(e.target.value)}
                        className="text-[16px] p-3 border border-gray-300 rounded-md w-full"

                    />
                </div>
            </div>
        </section>
    );
}