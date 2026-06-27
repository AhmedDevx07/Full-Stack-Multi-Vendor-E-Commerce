"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Link from "next/link"; // Link import karein
import { toast } from "sonner"; // 👈 Import karein
export default function ProductCard({ product }) {
  const { addToCart } = useCart();
const [imageUrl, setImageUrl] = useState("");
  return (
    
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
      
      {/* Product Image Clickable Link */}
      <Link href={`/products/${product._id}`} className="block relative w-full aspect-square bg-gray-50 overflow-hidden border-b border-gray-100">
        <img
          src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-gray-800 shadow-sm">
          {product.category}
        </span>
      </Link>

      {/* Product Details Section */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div className="mb-3">
          <p className="text-[11px] font-medium text-indigo-600 mb-1">
            Seller: {product.vendorId?.name || "Verified Store"}
          </p>
          
          {/* Title Clickable Link */}
          <Link href={`/products/${product._id}`}>
            <h3 className="font-bold text-gray-800 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors duration-200">
              {product.title}
            </h3>
          </Link>
          
          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">Price</span>
            <span className="text-lg font-extrabold text-gray-900">${product.price}</span>
          </div>

           <button
  onClick={() => {
    addToCart(product);
    toast.success(`${product.title} added to cart!`, {
      description: "Aap cart page par ja kar checkout kar sakte hain.",
    });
  }}
  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200"
>
  Add to Cart
</button>
        </div>
      </div>
    </div>
  );
}