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
  const bestSellingProducts = products.filter((p) => p.stock < 50).slice(0, 4); // Simulated best sellers

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
              Shop high-quality, verified telemetry items directly from
              independent merchants globally with transparent decentralized
              pipeline tracking.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md transition duration-200 tracking-wide uppercase"
              >
                Explore Marketplace
              </Link>
              <Link
                href="/about"
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition duration-200 tracking-wide uppercase backdrop-blur-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 3. LATEST PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Latest Inclusions
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Freshly uploaded assets into the global feed grid matrix
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl h-72 border border-gray-100"
              ></div>
            ))}
          </div>
        ) : latestProducts.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl">
            <p className="text-gray-400 text-xs font-medium">
              No active listings inside cluster node.
            </p>
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
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Best Selling Marketplace Feeds
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Highest order transaction velocity records this week
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl h-72 border border-gray-100"
              ></div>
            ))}
          </div>
        ) : bestSellingProducts.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl">
            <p className="text-gray-400 text-xs font-medium">
              No trending data points available yet.
            </p>
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
