"use client";
import { useState, useEffect } from "react";

export default function OAuthSection() {

    const handleLogin = () => {
    }



    const handle2FA = (e) => {
    }

    return (
        <section>
            <p className="text-3xl font-bold mb-3">OAuth & 2FA Integration</p>
            <div className="flex flex-col gap-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200 ">

                {/* Login */}
                <div>
                    <p className="text-[18px] font-bold mb-2">Secure Login</p>

                    <div className="flex  gap-2">
                        <button onClick={handleLogin}
                            className="text-[18px] bg-blue-600 text-white p-3 rounded hover:cursor-pointer hover:bg-blue-700">
                                Login With Google
                        </button>
                        <button onClick={handleLogin}
                            className="text-[18px] bg-blue-600 text-white p-3 rounded hover:cursor-pointer hover:bg-blue-700">
                                Login With GitHub
                        </button>
                    </div>
                </div>

                {/* 2FA Code */}
                <div className="w-full">
                    <p>Enter 2FA Code</p>
                    <input type="text" placeholder="Enter Your 2FA code" onChange={(e) => handle2FA(e.target.value)} 
                        className="text-[16px] p-3 border border-gray-300 rounded-md w-full"
                    />
                </div>
            </div>


        </section>
    );

}