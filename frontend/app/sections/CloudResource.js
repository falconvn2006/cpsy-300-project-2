"use client";
import { useState } from "react";

export default function CloudResourceSection() {
  const [loading, setLoading] = useState(false);

  const handleCleanUp = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cleanup`,
        { method: "POST" }
      );

      const data = await res.json();

      alert(data.message || "Cleanup completed");
    } catch (err) {
      console.error("Cleanup failed:", err);
      alert("Cleanup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">
        Cloud Resource Cleanup
      </h2>

      <div className="bg-white p-4 shadow-lg rounded-lg">
        <p className="text-sm text-gray-600 mb-4">
          Ensure that cloud resources are efficiently managed and cleaned up post-deployment.
        </p>

        <button
          onClick={handleCleanUp}
          disabled={loading}
          className="bg-red-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? "Cleaning..." : "Clean Up Resources"}
        </button>
      </div>
    </section>
  );
}