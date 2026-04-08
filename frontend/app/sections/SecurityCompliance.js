"use client";
import { useState, useEffect } from "react";

export default function SecuritySection() {
  const [securityStatus, setSecurityStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSecurityData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/security-status`);
        const data = await res.json();
        setSecurityStatus(data);
      } catch (err) {
        console.error("Security Status failed to load:", err);
        setSecurityStatus({
          encryption: "Unavailable",
          access_control: "Unavailable",
          compliance: "Unavailable"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchSecurityData();
  }, []);

  return (
    <section className="mb-8">
      <p className="text-3xl font-bold mb-3">Security & Compliance</p>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        {loading ? (
          <p className="text-gray-500">Loading security status...</p>
        ) : (
          <div className="space-y-2">
            <p className="text-[18px] font-bold">Security Status</p>
            <p className="text-[16px]">Encryption: <span className="font-medium">{securityStatus?.encryption}</span></p>
            <p className="text-[16px]">Access Control: <span className="font-medium">{securityStatus?.access_control}</span></p>
            <p className="text-[16px]">Compliance: <span className="font-medium">{securityStatus?.compliance}</span></p>
          </div>
        )}
      </div>
    </section>
  );
}