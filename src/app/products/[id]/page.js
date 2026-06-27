"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { id } = useParams(); // URL se unique product ID reading line
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        
        if (res.ok) {
          setProduct(data);
        } else {
          toast.error(data.message || "Product is currently unavailable");
          router.push("/"); // Direct reverse routing if asset is offline
        }
      } catch (err) {
        toast.error("Internal data pipeline crash");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    // 🌟 LOCAL STORAGE SYSTEM CART STATE CONFIGURATION
    const existingCart = JSON.parse(localStorage.getItem("ecom_cart")) || [];
    
    const cartItem = {
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.images?.[0],
      quantity: Number(quantity),
      vendorName: product.vendorId?.name || "Official Merchant"
    };

    // Check agar item pehle se cart mein hai toh quantity add up karein
    const duplicateIndex = existingCart.findIndex(item => item.productId === product._id);
    if (duplicateIndex > -1) {
      existingCart[duplicateIndex].quantity += Number(quantity);
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("ecom_cart", JSON.stringify(existingCart));
    
    // Sonner Glassmorphic Callout
    toast.success(`${product.title} added to cart!`, {
      description: `Quantity: ${quantity} units successfully cached.`,
    });
  };

  if (loading) return <div className="text-center p-24 font-mono text-xs text-indigo-600">Streaming Individual Asset Nodes...</div>;
  if (!product) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans min-h-screen bg-white mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* LEFT COLUMN: Premium Image Gallery frame */}
        <div className="space-y-4">
          <div className="border border-gray-100 rounded-3xl overflow-hidden aspect-square bg-gray-50/30">
            <img 
              src={product.images?.[0] || "/placeholder.png"} 
              className="w-full h-full object-cover transition duration-300 hover:scale-105" 
              alt={product.title} 
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Buy Matrix Info */}
        <div className="flex flex-col h-full space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg">
                {product.category}
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${product.stock > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
              </span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">{product.title}</h1>
            <p className="text-xs text-gray-400 mt-2 font-medium">Verified Vendor: <span className="text-indigo-600 font-bold">{product.vendorId?.name || "Unknown Merchant"}</span></p>
          </div>

          <div className="border-t border-b border-gray-100 py-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Retail Marketplace Price</span>
            <div className="text-3xl font-black text-gray-900 mt-1">${product.price.toFixed(2)}</div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">{product.description}</p>
          </div>

          {/* Interactive Core Buying Row Control */}
          {product.stock > 0 && (
            <div className="pt-6 space-y-4 border-t border-gray-100 mt-auto">
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold text-gray-400 uppercase">Qty:</label>
                <select 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)}
                  className="border border-gray-200 text-xs font-bold rounded-xl p-2 bg-gray-50 focus:outline-none"
                >
                  {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleAddToCart}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs py-4 rounded-2xl shadow-sm transition-all duration-200 text-center"
              >
                Secure to Shopping Cart
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}