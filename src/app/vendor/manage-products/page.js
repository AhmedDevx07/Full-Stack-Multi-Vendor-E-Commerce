"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // 📥 Fetch Merchant Inventory Feed
  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("ecom_token");
      const res = await fetch("/api/vendor/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch (err) {
      toast.error("Telemetry sync failure.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // 🔄 Toggle Live Visibility Switch (PUT Handler Link)
  const handleToggleVisibility = async (productId, currentStatus) => {
    try {
      setProcessingId(productId);
      const res = await fetch("/api/vendor/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, isActive: !currentStatus }),
      });

      if (res.ok) {
        setProducts(products.map(p => p._id === productId ? { ...p, isActive: !currentStatus } : p));
        toast.success("Marketplace visibility updated successfully.");
      } else {
        toast.error("Failed to alter catalog feed state.");
      }
    } catch (err) {
      toast.error("Visibility switch execution error.");
    } finally {
      setProcessingId(null);
    }
  };

  // 🗑️ Purge Asset From Database Network Nodes (DELETE Handler Link)
  const handlePurgeProduct = async (productId) => {
    if (!confirm("Are you absolutely sure you want to completely wipe this asset from production nodes?")) return;

    try {
      setProcessingId(productId);
      const token = localStorage.getItem("ecom_token");
      const res = await fetch(`/api/vendor/products?id=${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setProducts(products.filter(p => p._id !== productId));
        toast.success("Product permanent record cleared.");
      } else {
        toast.error("Database purge rejected by safety blocks.");
      }
    } catch (err) {
      toast.error("Destruction operational failure.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-2">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-mono text-[9px] tracking-widest text-indigo-500 uppercase font-bold">Parsing Inventory Arrays...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      
      {/* Upper Control Strip */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-gray-100">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Active Inventory Fleet</h1>
          <p className="text-xs text-gray-400 mt-0.5">Modify, toggle visibility nodes, or wipe active merchant stock rows.</p>
        </div>
        <span className="text-[10px] font-black font-mono bg-gray-100 px-3 py-1.5 rounded-xl text-gray-500">
          Total Fleet Nodes: {products.length}
        </span>
      </div>

      {products.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="text-2xl">📦</div>
          <p className="text-xs text-gray-400 font-medium">No live inventory instances registered inside this merchant pipeline.</p>
          <Link href="/vendor/add-product" className="inline-block bg-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl">
            Launch First Asset
          </Link>
        </div>
      ) : (
        /* 📊 THE PORTAL DATA MATRIX GRID */
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100">
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-gray-400">Asset Identity / Node</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-gray-400">Category</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-gray-400">Financial Metrics</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-gray-400">Stock Capacity</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-gray-400">Verification Gate</th>
                  <th className="p-4 text-right text-[10px] font-black uppercase tracking-wider text-gray-400">Pipeline Control Buttons</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/40 transition duration-150 group">
                    
                    {/* Identity Node */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center text-xs font-mono text-gray-400 relative flex-shrink-0">
                          {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            "N/A"
                          )}
                        </div>
                        <div className="max-w-[200px] truncate">
                          <h4 className="text-xs font-black text-gray-800 group-hover:text-indigo-600 transition truncate">{product.title}</h4>
                          <span className="text-[9px] text-gray-400 font-mono block mt-0.5 max-w-[150px] truncate">{product._id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category Label */}
                    <td className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                        {product.category || "General"}
                      </span>
                    </td>

                    {/* Pricing Core */}
                    <td className="p-4">
                      <span className="text-xs font-black text-gray-900">${product.price?.toFixed(2)}</span>
                    </td>

                    {/* Stock Alert Block */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className={`text-xs font-bold ${product.stock < 5 ? "text-rose-500 font-black" : "text-gray-700"}`}>
                          {product.stock} units
                        </span>
                        {product.stock < 5 && (
                          <span className="block text-[8px] font-black bg-rose-50 text-rose-500 px-1 rounded-sm w-max uppercase tracking-tight">Critical Low</span>
                        )}
                      </div>
                    </td>

                    {/* Status Approval Block */}
                    <td className="p-4">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        product.isApproved === "approved" ? "bg-emerald-50 text-emerald-600" :
                        product.isApproved === "rejected" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        {product.isApproved || "pending"}
                      </span>
                    </td>

                    {/* Actions Controller Strip */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* Toggle Active Stream Switch */}
                        <button
                          onClick={() => handleToggleVisibility(product._id, product.isActive !== false)}
                          disabled={processingId === product._id}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border transition ${
                            product.isActive !== false 
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20" 
                              : "bg-gray-100 border-gray-200 text-gray-400 hover:bg-gray-200/60"
                          }`}
                        >
                          {product.isActive !== false ? "📡 Live Feed" : "💤 Offline"}
                        </button>

                        {/* Force Purge Action */}
                        <button
                          onClick={() => handlePurgeProduct(product._id)}
                          disabled={processingId === product._id}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-xl border border-rose-100 transition"
                          title="Purge Asset Permanent"
                        >
                          🗑️
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}