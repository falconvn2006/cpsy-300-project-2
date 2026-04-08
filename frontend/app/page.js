"use client";

import { useState, useEffect } from "react";
import { auth } from "./firebase";

import SecuritySection from "./sections/SecurityCompliance";
import OAuthSection from "./sections/OAuth";
import CloudResourceSection from "./sections/CloudResource";

export default function Home() {
  const [search, setSearch] = useState("");
  const [diet, setDiet] = useState("All");

  const [results, setResults] = useState([]);
  const [insights, setInsights] = useState(null);
  const [clusters, setClusters] = useState([]);

  const [barImage, setBarImage] = useState(null);
  const [scatterImage, setScatterImage] = useState(null);
  const [heatmapImage, setHeatmapImage] = useState(null);
  const [pieImage, setPieImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch chart images
  useEffect(() => {
    async function fetchCharts() {
      try {
        const [bar, scatter, heatmap, pie] = await Promise.all([
          fetch(`${baseUrl}/bar-chart-data`).then((res) => res.text()),
          fetch(`${baseUrl}/scatter-plot-data`).then((res) => res.text()),
          fetch(`${baseUrl}/heatmap-data`).then((res) => res.text()),
          fetch(`${baseUrl}/pie-chart-data`).then((res) => res.text()),
        ]);

        setBarImage(bar);
        setScatterImage(scatter);
        setHeatmapImage(heatmap);
        setPieImage(pie);
      } catch (err) {
        console.error("Chart load failed:", err);
      }
    }
    fetchCharts();
  }, [baseUrl]);

  const getQuery = () =>
    diet !== "All" ? diet.toLowerCase() : search.toLowerCase();

  async function getAuthHeader() {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in first");
      throw new Error("User not logged in");
    }
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  }

  const fetchData = async (endpoint, setterResults, setterInsights, setterClusters) => {
    try {
      setLoading(true);
      const headers = await getAuthHeader();
      const res = await fetch(`${baseUrl}/${endpoint}?diet_type=${getQuery()}`, { headers });
      const data = await res.json();

      setterResults([]);
      setterInsights(null);
      setterClusters([]);
      if (endpoint === "recipes") setterResults(data);
      if (endpoint === "nutritional-insights") setterInsights(data);
      if (endpoint === "clusters") setterClusters(data);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecipes = () =>
    fetchData("recipes", setResults, setInsights, setClusters);
  const handleGetInsights = () =>
    fetchData("nutritional-insights", setResults, setInsights, setClusters);
  const handleGetClusters = () =>
    fetchData("clusters", setResults, setInsights, setClusters);

  const maxPage = Math.ceil(results.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      <header className="bg-blue-600 shadow">
        <div className="container mx-auto px-4 sm:px-6 py-6 text-white">
          <h1 className="text-3xl font-semibold">Nutritional Insights</h1>
        </div>
      </header>

      <main className="container mx-auto p-6">

        {/* Charts */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Explore Nutritional Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ChartCard title="Bar Chart" image={barImage} />
            <ChartCard title="Scatter Plot" image={scatterImage} />
            <ChartCard title="Heat Map" image={heatmapImage} />
            <ChartCard title="Pie Chart" image={pieImage} />
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Filters and Data Interaction</h2>
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search by Diet Type"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border rounded w-full sm:w-auto"
            />
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="p-2 border rounded w-full sm:w-auto"
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

        {/* API Data Interaction - Redesigned */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">API Data Interaction</h2>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={handleGetInsights}
              disabled={loading}
              className={`py-2 px-5 rounded-lg font-medium transition-colors ${
                loading 
                  ? "bg-blue-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Get Nutritional Insights
            </button>
            <button
              onClick={handleGetRecipes}
              disabled={loading}
              className={`py-2 px-5 rounded-lg font-medium transition-colors ${
                loading 
                  ? "bg-green-400 cursor-not-allowed" 
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              Get Recipes
            </button>
            <button
              onClick={handleGetClusters}
              disabled={loading}
              className={`py-2 px-5 rounded-lg font-medium transition-colors ${
                loading 
                  ? "bg-purple-400 cursor-not-allowed" 
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              Get Clusters
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 min-h-[200px]">
            {loading && <p className="animate-pulse text-blue-500">Loading data from backend...</p>}

            {/* INSIGHTS VIEW - Three Card Layout */}
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

            {/* RECIPES VIEW - With Table and Pagination */}
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
                {maxPage > 1 && (
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
                )}
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

            {/* Empty State */}
            {!loading && insights === null && results.length === 0 && clusters.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>Click any button above to fetch data</p>
              </div>
            )}
          </div>
        </section>

        {/* Other Sections */}
        <div className="flex flex-col gap-10">
          <SecuritySection />
          <OAuthSection />
          <CloudResourceSection />
        </div>
      </main>

      <footer className="bg-blue-600 p-4 text-white text-center mt-10">
        <p>&copy; 2026 Nutritional Insights. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// Chart Card Component
function ChartCard({ title, image }) {
  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <h3 className="font-semibold">{title}</h3>
      <div className="w-full h-48 flex items-center justify-center">
        {image ? (
          <img src={`data:image/png;base64,${image}`} alt={title} className="object-contain h-full w-full" />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}