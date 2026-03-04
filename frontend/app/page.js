"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [diet, setDiet] = useState("all");

  const barRef = useRef(null);
  const scatterRef = useRef(null);
  const pieRef = useRef(null);

  function handleGetInsights() {
    console.log("Get Nutritional Insights", { search, diet });
    alert("Get Nutritional Insights (placeholder)");
  }

  function handleGetRecipes() {
    console.log("Get Recipes", { search, diet });
    alert("Get Recipes (placeholder)");
  }

  function handleGetClusters() {
    console.log("Get Clusters", { search, diet });
    alert("Get Clusters (placeholder)");
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      <header className="bg-blue-600 shadow">
        <div className="container mx-auto px-4 sm:px-6 py-6 text-white">
          <h1 className="text-3xl font-semibold">Nutritional Insights</h1>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Explore Nutritional Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col gap-4">
              <h3 className="font-semibold">Bar Chart</h3>
              <p className="text-sm text-gray-600">Average macronutrient content by diet type.</p>
              <div className="w-full h-56 mt-2 bg-gray-50 rounded flex items-center justify-center">
                <canvas id="barChart" ref={barRef} className="w-full h-full" />
              </div>
            </div>

            <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col gap-4">
              <h3 className="font-semibold">Scatter Plot</h3>
              <p className="text-sm text-gray-600">Nutrient relationships (e.g., protein vs carbs).</p>
              <div className="w-full h-56 mt-2 bg-gray-50 rounded flex items-center justify-center">
                <canvas id="scatterPlot" ref={scatterRef} className="w-full h-full" />
              </div>
            </div>

            <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col gap-4">
              <h3 className="font-semibold">Heatmap</h3>
              <p className="text-sm text-gray-600">Nutrient correlations.</p>
              <div id="heatmap" className="w-full h-56 mt-2 bg-gray-50 rounded flex items-center justify-center" />
            </div>

            <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col gap-4">
              <h3 className="font-semibold">Pie Chart</h3>
              <p className="text-sm text-gray-600">Recipe distribution by diet type.</p>
              <div className="w-full h-56 mt-2 bg-gray-50 rounded flex items-center justify-center">
                <canvas id="pieChart" ref={pieRef} className="w-full h-full" />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Filters and Data Interaction</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search by Diet Type"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-3 border border-gray-300 rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="p-3 border border-gray-300 rounded-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Diet Types</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
            </select>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">API Data Interaction</h2>
          <div className="flex flex-wrap gap-4">
            <button onClick={handleGetInsights} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-lg font-medium transition-colors">Get Nutritional Insights</button>
            <button onClick={handleGetRecipes} className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-lg font-medium transition-colors">Get Recipes</button>
            <button onClick={handleGetClusters} className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-5 rounded-lg font-medium transition-colors">Get Clusters</button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Pagination</h2>
          <div className="flex justify-center gap-3 mt-4">
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition">Previous</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">1</button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition">2</button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition">Next</button>
          </div>
        </section>
      </main>

      <footer className="bg-blue-600 p-6 text-white text-center mt-10">
        <p>&copy; 2025 Nutritional Insights. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
