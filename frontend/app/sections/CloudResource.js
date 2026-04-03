"use client";
import { useState, useEffect } from "react";


export default function CloudResourceSection() {
    
    const handleCleanUp = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cleanup`, { method: 'POST' });
        const data = await res.json();
        alert(data.message);
    }

    return (
        <section>
            <p className="text-3xl font-bold mb-3">Cloud Resource Cleanup</p>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 ">
                <p>Ensure that cloud resources are efficiently managed and cleaned up post-deployment.</p>
                <button onClick={handleCleanUp} 
                    className="text-[18px] bg-red-600 text-white p-3 rounded hover:cursor-pointer hover:bg-red-700">
                        Clean Up Resources
                </button>
            </div>



        </section>
    );

}