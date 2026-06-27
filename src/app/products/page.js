"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (res.ok) {
          setProducts(data);
          setFilteredProducts(data);
          
          // Dynamic category extraction node
          const uniqueCategories = ["All", ...new Set(data.map(p => p.category).filter(Boolean))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching shop products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Sync state tracking filter engine
  useEffect(() => {
    let result = products;

    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim() !== "") {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, products]);

  return (
    <div className="bg-gray-50/30 min-h-screen font-sans antialiased text-gray-800">
      
      {/* 🏙️ HEADER NODE */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 border-b border-gray-100">
        <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
          Global Catalog Index
        </span>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-2 sm:text-3xl">
          Marketplace Asset Feed
        </h1>
        <p className="text-xs text-gray-400 mt-1 max-w-xl font-medium">
          Browse verified real-time items directly populated across decentralized vendor node networks.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* 🛠️ LEFT SIDEBAR: CONTROL STATION FILTER PANEL */}
          <aside className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm sticky top-24 space-y-6">
            
            {/* Search Input Control */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
                Search Catalog
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by keyword..." 
                  className="w-full text-xs font-medium bg-gray-50 border border-gray-100 rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
                <span className="absolute right-3.5 top-3.5 text-gray-400 text-xs">🔍</span>
              </div>
            </div>

            {/* Vertical Categories Selection */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
                Filter Categories
              </label>
              <div className="space-y-1.5">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-150 capitalize flex items-center justify-between group ${
                      selectedCategory === category
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span>{category}</span>
                    {selectedCategory !== category && (
                      <span className="text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition duration-150">
                        ➔
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* 📦 RIGHT CONTENT LAYOUT: ACTIVE LISTINGS STREAM */}
          <main className="lg:col-span-3">
            
            <div className="flex justify-between items-center mb-6">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Telemetry Output: {filteredProducts.length} Listings Loaded
              </div>
            </div>

            {/* UI Content Rendering States */}
            {loading ? (
              /* PREMIUM SKELETON LOADER CARDS GRID */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-3xl p-4 h-80 flex flex-col justify-between animate-pulse">
                    <div className="bg-gray-100 h-44 rounded-2xl w-full"></div>
                    <div className="space-y-2 mt-4">
                      <div className="bg-gray-100 h-4 rounded-xl w-3/4"></div>
                      <div className="bg-gray-100 h-3 rounded-xl w-1/2"></div>
                    </div>
                    <div className="bg-gray-100 h-8 rounded-xl w-full mt-4"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              /* CLEAN BLANK EMBED MATRIX */
              <div className="text-center py-24 bg-white border border-gray-100 rounded-3xl shadow-sm">
                <div className="text-2xl mb-2">📁</div>
                <p className="font-extrabold text-gray-800 text-sm tracking-tight">Zero Asset Density Matching Query</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  No active server listings found matching your current dashboard selection parameters. Adjust filter nodes.
                </p>
              </div>
            ) : (
              /* ACTUAL DYNAMIC PRODUCTS CARD GRID */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

          </main>

        </div>
      </div>
    </div>
  );
}