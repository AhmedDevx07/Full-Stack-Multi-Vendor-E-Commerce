"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminVendorsManagement() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem("ecom_token");
      const res = await fetch("/api/admin/vendors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setVendors(data);
    } catch (err) {
      toast.error("Failed to load global merchant registry logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleDeleteVendor = async (vendorId) => {
    if (!window.confirm("WARNING: Is vendor ko delete karne se iske saare listed products bhi market se hamesha ke liye delete ho jayenge. Kya aap sure hain?")) return;
    
    try {
      const res = await fetch(`/api/admin/vendors?id=${vendorId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Merchant system node purged successfully.");
        setVendors(vendors.filter(v => v._id !== vendorId));
      }
    } catch (error) {
      toast.error("Purge operations crashed.");
    }
  };

  if (loading) return <div className="text-center p-20 font-mono text-xs text-gray-400">Syncing Master Vendor Registry Matrix...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans bg-gray-50/20 min-h-screen">
      <div>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Merchant Node Registry</h1>
        <p className="text-xs text-gray-400 mt-0.5">Global administrative command directory for active system vendor profiles.</p>
      </div>

      <div className="grid gap-4 mt-8">
        {vendors.map((vendor) => (
          <div key={vendor._id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm gap-4">
            <div>
              <h3 className="font-bold text-gray-800 text-sm capitalize">{vendor.name}</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">System Reference UID: <span className="font-mono text-gray-500 font-normal">{vendor._id}</span></p>
              <p className="text-xs text-indigo-600 font-bold mt-1">{vendor.email}</p>
            </div>
            
            <button 
              onClick={() => handleDeleteVendor(vendor._id)}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs px-4 py-2.5 rounded-xl transition duration-150"
            >
              Purge Account
            </button>
          </div>
        ))}

        {vendors.length === 0 && (
          <p className="text-xs text-center text-gray-400 font-mono py-12">No active vendor nodes detected inside database registry.</p>
        )}
      </div>
    </div>
  );
}