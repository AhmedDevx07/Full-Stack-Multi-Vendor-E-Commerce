"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VendorDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [syncing, setSyncing] = useState(true);

  // Function to fetch vendor stats
  const compileVendorMetrics = async () => {
    try {
      const token = localStorage.getItem("ecom_token");
      const res = await fetch("/api/vendor/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (error) {
      console.error("Critical dashboard failure:", error);
    } finally {
      setSyncing(false);
    }
  };

  // Protection Guard
  useEffect(() => {
    if (!loading && (!user || user.role !== "vendor")) {
      router.push("/login");
    }
  }, [user, loading]);

  // Initial fetch and auto-refresh
  useEffect(() => {
    if (user && user.role === "vendor") {
      compileVendorMetrics();
      const interval = setInterval(compileVendorMetrics, 10000); // Auto-refresh every 10s
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [user]);

  if (loading || syncing) {
    return (
      <div className="text-center py-20 font-semibold animate-pulse text-indigo-600">
        Syncing Merchant Node Matrix...
      </div>
    );
  }

  // Helper function to get status color
  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "completed" || s === "delivered") return "bg-emerald-50 text-emerald-700";
    if (s === "pending" || s === "processing") return "bg-amber-50 text-amber-700";
    if (s === "shipped") return "bg-blue-50 text-blue-700";
    if (s === "cancelled") return "bg-red-50 text-red-700";
    return "bg-gray-50 text-gray-700";
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans">
      {/* Top Banner Row */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Merchant Central Command
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Real-time marketplace telemetry • Operator: <b className="text-gray-700">{user?.name}</b>
        </p>
      </div>

      <div className="flex gap-3 mb-6 mt-4 flex-wrap">
        <Link href="/vendor/add-product" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition duration-150 shadow-sm">
          📦 Launch New Product
        </Link>
        <Link href="/vendor/manage-products" className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl transition duration-150 shadow-sm">
          🔧 Manage Products
        </Link>
        <Link href="/vendor/orders" className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl transition duration-150 shadow-sm">
          📋 View Orders
        </Link>
      </div>

      {/* Corporate Vendor Bento Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
            Total Revenue
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ${stats?.totalSales?.toLocaleString() || 0}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Your processed payments</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
            Total Orders
          </span>
          <div className="text-2xl font-black text-gray-900 mt-1">
            {stats?.totalOrders || 0}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Your orders lifetime</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
            Approved Products
          </span>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {stats?.approvedProducts || 0}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Live on marketplace</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
            Total Catalog
          </span>
          <div className="text-2xl font-black text-gray-900 mt-1">
            {stats?.totalProducts || 0}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">All your listings</p>
        </div>
      </div>

      {/* Vendor Order Stream */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-sm font-black text-gray-800 uppercase tracking-tight">
            Your Live Order Feed
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">
              Auto-Refreshing
            </span>
            <button 
              onClick={compileVendorMetrics}
              className="text-[10px] bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider transition"
            >
              Refresh Now
            </button>
          </div>
        </div>

        {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm font-medium">
            No orders for your products yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[10px] uppercase font-black text-gray-400 tracking-wider border-b border-gray-100">
                  <th className="px-6 py-3.5">Order Reference</th>
                  <th className="px-6 py-3.5">Customer Name</th>
                  <th className="px-6 py-3.5">Your Settlement</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/70 transition duration-150">
                    <td className="px-6 py-4 font-mono text-xs text-indigo-600 font-bold">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      <div>{order.shippingDetails?.fullName || "Anonymous Buyer"}</div>
                      <span className="text-[10px] text-gray-400 font-normal block">
                        {order.shippingDetails?.city}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900">
                      ${order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(order.status || order.orderStatus)}`}>
                        {order.status || order.orderStatus || "Processing"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
