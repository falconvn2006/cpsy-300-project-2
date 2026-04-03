"use client";
import { useState, useEffect } from "react";

export default function SecuritySection() {

    const [securityStatus, setSecurityStatus] = useState(null);

    useEffect(() => {
        async function fetchSecurityData() {
            try {
                const [securityData] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/security-status`).then((res) => res.json()),
                ]);

                setSecurityStatus(securityData);
            } catch (err) {
                console.error("Security Status failed to load:", err);
            }
        }

        fetchSecurityData();
    }, []);

    return (
        <section>
            <p className="text-3xl font-bold mb-3">Security & Compliance</p>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 ">
                <p className="text-[18px] font-bold">Security Status</p>

                <p className="text-[16px]">Encryption: <span>{securityStatus?.encryption}</span></p>
                <p className="text-[16px]">Access Control: <span>{securityStatus?.access_control}</span></p>
                <p className="text-[16px]">Compliance: <span>{securityStatus?.compliance}</span></p>
            </div>
        </section>
    );

}