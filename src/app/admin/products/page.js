"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch (err) {
      toast.error("Failed to load catalog lifecycle grid");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleStatusChange = async (productId, status) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, status }),
      });

      if (res.ok) {
        toast.success(`Product successfully ${status}!`);
        fetchAllProducts(); // List refresh karein live update ke baad
      } else {
        toast.error("Pipeline action aborted");
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  // 🔥 Administrative Force Purge Handler
  const handleForceDelete = async (productId) => {
    if (!window.confirm("WARNING: Kya aap waqai is product ko poore marketplace se permanent delete/purge karna chahte hain?")) return;
    
    try {
      const res = await fetch(`/api/admin/products?id=${productId}`, { 
        method: "DELETE" 
      });
      
      if (res.ok) {
        toast.success("Product forcefully purged by administration node!");
        fetchAllProducts(); // Refresh layout database matrix cache
      } else {
        toast.error("Failed to execute purge telemetry.");
      }
    } catch (error) {
      toast.error("Operation aborted due to network crash.");
    }
  };

  if (loading) return <div className="text-center p-10 font-mono text-xs">Loading Central Inventory Matrix...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <h1 className="text-xl font-black text-gray-900 tracking-tight mb-1">Merchant Inventory Control</h1>
      <p className="text-xs text-gray-400 mb-6">Approve or reject vendor products before they hit the live marketplace store fronts.</p>

      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between shadow-sm gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <img src={product.images?.[0] || "/placeholder.png"} className="w-14 h-14 rounded-xl object-cover border border-gray-50 flex-shrink-0" alt="" />
              <div className="truncate max-w-md">
                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                  product.isApproved === "approved" ? "bg-emerald-50 text-emerald-600" :
                  product.isApproved === "rejected" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                }`}>
                  {product.isApproved}
                </span>
                <h3 className="font-bold text-gray-800 text-sm truncate mt-1">{product.title}</h3>
                <p className="text-xs text-gray-400 font-medium">Vendor: {product.vendorId?.name || "Unknown Store"} | Price: ${product.price}</p>
              </div>
            </div>

            {/* Global Actions Row Container */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Dynamic Status Action Controller (Only for Pending Items) */}
              {product.isApproved === "pending" && (
                <>
                  <button onClick={() => handleStatusChange(product._id, "rejected")} className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs px-4 py-2 rounded-xl transition duration-150">
                    Reject
                  </button>
                  <button onClick={() => handleStatusChange(product._id, "approved")} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm duration-150">
                    Approve Live
                  </button>
                </>
              )}

              {/* ⚡ Force Purge Action (Always accessible for all products) */}
              <button 
                onClick={() => handleForceDelete(product._id)} 
                className="bg-gray-50 hover:bg-rose-50 hover:text-rose-600 text-gray-400 font-bold text-xs px-4 py-2 rounded-xl transition duration-150"
              >
                Force Purge
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="text-xs text-center text-gray-400 py-10 font-mono">No products listed inside the system catalog logs.</p>}
      </div>
    </div>
  );
}