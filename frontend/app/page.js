"use client";

import { useState, useEffect } from "react";

export default function Home() {
  // Filters
  const [search, setSearch] = useState("");
  const [diet, setDiet] = useState("All");

  // Data results
  const [results, setResults] = useState([]);
  const [insights, setInsights] = useState(null);
  const [clusters, setClusters] = useState([]);

  // Chart
  const [barImage, setBarImage] = useState(null);
  const [scatterImage, setScatterImage] = useState(null);
  const [heatmapImage, setHeatmapImage] = useState(null);
  const [pieImage, setPieImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  //  Fetch all charts data
  useEffect(() => {
    async function fetchAllCharts() {
      try {
        const [bar, scatter, heatmap, pie] = await Promise.all([
          fetch(`${baseUrl}/bar-chart-data`).then(res => res.text()),
          fetch(`${baseUrl}/scatter-plot-data`).then(res => res.text()),
          fetch(`${baseUrl}/heatmap-data`).then(res => res.text()),
          fetch(`${baseUrl}/pie-chart-data`).then(res => res.text()),
        ]);

        setBarImage(bar);
        setScatterImage(scatter);
        setHeatmapImage(heatmap);
        setPieImage(pie);
      } catch (err) {
        console.error("Charts failed to load:", err);
      }
    }
    fetchAllCharts();
  }, [baseUrl]);

  const getQuery = () => (diet !== "All" ? diet : search);

  // Get recipes, insights, or clusters based on user interaction
  async function handleGetRecipes() {
    setLoading(true);
    const res = await fetch(`${baseUrl}/recipes?diet_type=${getQuery()}`);
    const data = await res.json();
    setResults(data);
    setInsights(null);
    setClusters([]);
    setCurrentPage(1);
    setLoading(false);
  }

  async function handleGetInsights() {
    const res = await fetch(`${baseUrl}/nutritional-insights?diet_type=${getQuery()}`);
    const data = await res.json();
    setInsights(data);
    setResults([]);
    setClusters([]);
  }

  async function handleGetClusters() {
    const res = await fetch(`${baseUrl}/clusters?diet_type=${getQuery()}`);
    const data = await res.json();
    setClusters(data);
    setResults([]);
    setInsights(null);
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
              <div className="w-full h-56 mt-2 bg-gray-50 rounded flex items-center justify-center overflow-hidden">
                {barImage ? (
                  <img
                    src={`data:image/png;base64,${barImage}`}
                    className="w-full h-full object-contain"
                    alt="Bar Chart"
                  />
                ) : (
                  <p className="text-gray-400">Loading...</p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col gap-4">
              <h3 className="font-semibold">Scatter Plot</h3>
              <div className="w-full h-56 mt-2 bg-gray-50 rounded flex items-center justify-center overflow-hidden">
                {scatterImage ? (
                  <img
                    src={`data:image/png;base64,${scatterImage}`}
                    className="w-full h-full object-contain"
                    alt="Scatter Plot"
                  />
                ) : (
                  <p className="text-gray-400">Loading...</p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col gap-4">
              <h3 className="font-semibold">Heat Map</h3>
              <div className="w-full h-56 mt-2 bg-gray-50 rounded flex items-center justify-center overflow-hidden">
                {heatmapImage ? (
                  <img
                    src={`data:image/png;base64,${heatmapImage}`}
                    className="w-full h-full object-contain"
                    alt="Heat Map"
                  />
                ) : (
                  <p className="text-gray-400">Loading...</p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col gap-4">
              <h3 className="font-semibold">Pie Chart</h3>
              <div className="w-full h-56 mt-2 bg-gray-50 rounded flex items-center justify-center overflow-hidden">
                {pieImage ? (
                  <img
                    src={`data:image/png;base64,${pieImage}`}
                    className="w-full h-full object-contain"
                    alt="Pie Chart"
                  />
                ) : (
                  <p className="text-gray-400">Loading...</p>
                )}
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
              <option value="All">All Diet Types</option>
              <option value="dash">Dash</option>
              <option value="keto">Keto</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="paleo">Paleo</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">API Data Interaction</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={handleGetInsights}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-lg font-medium transition-colors"
            >
              Get Nutritional Insights
            </button>
            <button
              onClick={handleGetRecipes}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-lg font-medium transition-colors"
            >
              Get Recipes
            </button>
            <button
              onClick={handleGetClusters}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-5 rounded-lg font-medium transition-colors"
            >
              Get Clusters
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 min-h-[200px]">
            {loading && <p className="animate-pulse text-blue-500">Loading data from backend...</p>}

            {/* INSIGHTS VIEW */}
            {insights && !loading && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <h4 className="text-xs font-bold text-blue-600 uppercase">Avg Protein</h4>
                  <p className="text-2xl font-black">{insights.average_protein?.toFixed(1)}g</p>
                </div>
                <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                  <h4 className="text-xs font-bold text-green-600 uppercase">Avg Carbs</h4>
                  <p className="text-2xl font-black">{insights.average_carbs?.toFixed(1)}g</p>
                </div>
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                  <h4 className="text-xs font-bold text-red-600 uppercase">Avg Fat</h4>
                  <p className="text-2xl font-black">{insights.average_fat?.toFixed(1)}g</p>
                </div>
              </div>
            )}

            {/* RECIPES VIEW - WITH PAGINATION */}
            {results.length > 0 && !loading && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-gray-400 text-xs uppercase font-bold">
                      <th className="pb-3">Recipe Name</th>
                      <th className="pb-3">Cuisine</th>
                      <th className="pb-3 text-right">Protein(g)</th>
                      <th className="pb-3 text-right">Carbs(g)</th>
                      <th className="pb-3 text-right">Fat(g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((r, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 pr-2 font-medium">{r.Recipe_name}</td>
                        <td className="py-3 italic text-gray-600">{r.Cuisine_type}</td>
                        <td className="py-3 text-right font-mono text-blue-600 font-bold">{r["Protein(g)"]}</td>
                        <td className="py-3 text-right font-mono text-green-600 font-bold">{r["Carbs(g)"]}</td>
                        <td className="py-3 text-right font-mono text-red-600 font-bold">{r["Fat(g)"]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* PAGINATION */}
                <div className="flex justify-center gap-4 mt-6 items-center">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-4 py-2 border rounded-lg disabled:opacity-30 hover:bg-gray-100"
                  >
                    Previous
                  </button>
                  <span className="font-bold text-blue-600">Page {currentPage}</span>
                  <button
                    disabled={currentPage * itemsPerPage >= results.length}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-4 py-2 border rounded-lg disabled:opacity-30 hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* CLUSTERS VIEW */}
            {clusters.length > 0 && !loading && (
              <div>
                <h4 className="text-sm font-bold text-purple-600 mb-4 uppercase">Nutrient Cluster Points (Raw Data)</h4>
                <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded">
                  {clusters.slice(0, 50).map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-white border border-purple-200 rounded text-[10px] font-mono shadow-sm"
                    >
                      P:{c["Protein(g)"]} | C:{c["Carbs(g)"]} | F:{c["Fat(g)"]}
                    </span>
                  ))}
                  {clusters.length > 50 && (
                    <p className="text-xs text-gray-400">...and {clusters.length - 50} more points.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-blue-600 p-6 text-white text-center mt-10">
        <p>&copy; 2025 Nutritional Insights. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
