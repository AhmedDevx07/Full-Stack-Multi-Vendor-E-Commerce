"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (res.ok) setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter systems according to your blueprint
  const latestProducts = products.slice(0, 4);
  const bestSellingProducts = products.filter(p => p.stock < 50).slice(0, 4); // Simulated best sellers

  return (
    <div className="text-gray-800 bg-gray-50/30 min-h-screen font-sans antialiased">
      
      {/* 🚀 1. ULTRA-MODERN HERO BANNER */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-6">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 rounded-3xl p-8 md:p-16 shadow-xl text-white relative overflow-hidden border border-slate-800">
          {/* Subtle Graphic Accents */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest px-3,5 py-1.5 rounded-full backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
              Next-Gen Multi-Vendor Network
            </span>
            <h1 className="text-4xl md:text-6xl font-black mt-5 leading-[1.1] tracking-tight bg-gradient-to-b from-white to-gray-200 bg-clip-text text-transparent">
              Discover Products From Top Independent Sellers.
            </h1>
            <p className="mt-4 text-xs md:text-sm text-slate-300 max-w-md font-medium leading-relaxed">
              Shop high-quality, verified telemetry items directly from independent merchants globally with transparent decentralized pipeline tracking.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/products" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md transition duration-200 tracking-wide uppercase">
                Explore Marketplace
              </Link>
              <Link href="/about" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition duration-200 tracking-wide uppercase backdrop-blur-sm">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 2. BENTO GRID: OUR SPECIFICATIONS */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Why E-MarketX?</h2>
          <p className="text-lg font-black text-gray-900 tracking-tight mt-0.5">Engineered for Premium Transactions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Box 1 */}
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm md:col-span-2 flex flex-col justify-between group hover:border-indigo-100 transition duration-300">
            <div>
              <div className="bg-indigo-50 text-indigo-600 h-10 w-10 rounded-xl flex items-center justify-center font-bold mb-4 text-sm">🛡️</div>
              <h3 className="font-extrabold text-gray-900 text-base tracking-tight">Verified Merchant Telemetry</h3>
              <p className="text-xs text-gray-400 mt-1.5 max-w-md font-medium leading-relaxed">
                Every single item uploaded undergo strict security validation nodes. Scrambled asset lists or fraud metrics are permanently blocked at administration level.
              </p>
            </div>
          </div>
          {/* Box 2 */}
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm flex flex-col justify-between group hover:border-indigo-100 transition duration-300">
            <div>
              <div className="bg-emerald-50 text-emerald-600 h-10 w-10 rounded-xl flex items-center justify-center font-bold mb-4 text-sm">⚡</div>
              <h3 className="font-extrabold text-gray-900 text-base tracking-tight">Instant Node Despatch</h3>
              <p className="text-xs text-gray-400 mt-1.5 font-medium leading-relaxed">
                Direct vendor notification engine optimizes processing workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 3. LATEST PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Latest Inclusions</h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Freshly uploaded assets into the global feed grid matrix</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition">View All →</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-72 border border-gray-100"></div>
            ))}
          </div>
        ) : latestProducts.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl">
            <p className="text-gray-400 text-xs font-medium">No active listings inside cluster node.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 📈 4. BEST SELLING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 py-8 mb-12">
        <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Best Selling Marketplace Feeds</h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Highest order transaction velocity records this week</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-72 border border-gray-100"></div>
            ))}
          </div>
        ) : bestSellingProducts.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl">
            <p className="text-gray-400 text-xs font-medium">No trending data points available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}