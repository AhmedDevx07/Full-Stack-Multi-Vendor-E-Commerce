"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);

  // Hydration safety pipeline + LocalStorage reader
  useEffect(() => {
    const cachedCart = JSON.parse(localStorage.getItem("ecom_cart")) || [];
    setCart(cachedCart);
    setMounted(true);
  }, []);

  const handleUpdateQty = (index, newQty) => {
    const updated = [...cart];
    updated[index].quantity = Number(newQty);
    setCart(updated);
    localStorage.setItem("ecom_cart", JSON.stringify(updated));
    toast.success("Cart item quantity updated!");
  };

  const handleRemoveItem = (index) => {
    const filtered = cart.filter((_, i) => i !== index);
    setCart(filtered);
    localStorage.setItem("ecom_cart", JSON.stringify(filtered));
    toast.error("Item removed from basket");
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // Prevents hydration mismatch by forcing wait until mounted on client
  if (!mounted) {
    return (
      <div className="p-6 max-w-5xl mx-auto font-sans min-h-screen bg-gray-50/30 flex items-center justify-center">
        <div className="space-y-4 text-center animate-pulse">
          <div className="h-4 bg-gray-200 rounded-xl w-32 mx-auto"></div>
          <div className="h-10 bg-gray-200 rounded-2xl w-64 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans min-h-screen bg-gray-50/30 mt-6 antialiased">
      {/* 🏷️ BASKET HEADER HEADER */}
      <div className="mb-8 border-b border-gray-100 pb-5">
        <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
          Secure Checking Node
        </span>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-2">
          Your Shopping Basket
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* 📦 LEFT CONTAINER: ITEMS PIPELINE FEED */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <div
              key={item._id || index}
              className="bg-white/80 backdrop-blur-md border border-gray-100/70 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-md/50 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4 truncate">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                  <img
                    src={item.images?.[0] || "/placeholder.png"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    alt=""
                  />
                </div>
                <div className="truncate">
                  <h3 className="font-bold text-gray-800 text-sm truncate group-hover:text-indigo-600 transition-colors duration-150">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                    Node:{" "}
                    <span className="text-gray-500 font-semibold">
                      {item.vendorId?.name || "Global"}
                    </span>
                  </p>
                  <p className="text-xs text-indigo-600 font-black mt-1">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Action Operations Controller */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="relative">
                  <select
                    value={item.quantity}
                    onChange={(e) => handleUpdateQty(index, e.target.value)}
                    className="appearance-none border border-gray-200/80 text-xs font-bold rounded-xl pl-3 pr-8 py-2 bg-gray-50 hover:bg-gray-100/50 cursor-pointer focus:outline-none focus:border-indigo-500 transition-all"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-2.5 top-2.5 pointer-events-none text-[9px] text-gray-400">
                    ▼
                  </span>
                </div>

                <button
                  onClick={() => handleRemoveItem(index)}
                  className="text-gray-400 hover:text-rose-500 hover:bg-rose-50/60 p-2 rounded-xl transition-all duration-150"
                  title="Remove asset"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-3xl p-6">
              <div className="text-3xl mb-3 animate-bounce">🛒</div>
              <p className="text-sm font-bold text-gray-800 tracking-tight">
                Your basket matrix is completely empty
              </p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                No active asset tokens detected inside your local cache
                pipeline. Let's fill it up!
              </p>
              <Link
                href="/products"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl mt-5 shadow-sm transition-all duration-150"
              >
                Browse System Catalog
              </Link>
            </div>
          )}
        </div>

        {/* 📑 RIGHT CONTAINER: SUMMARY ABSTRACT TRANSACTION CARD */}
        {cart.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 lg:sticky top-24">
            <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider border-b border-gray-50 pb-3">
              Order Abstract
            </h3>

            <div className="space-y-2.5 border-b border-gray-100 pb-4">
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span>Gross Weight Subtotal</span>
                <span className="font-bold text-gray-700">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs font-medium text-gray-400">
                <span>Logistics Route Pipeline</span>
                <span className="text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                  FREE DELIVERY
                </span>
              </div>
            </div>

            <div className="pt-1 flex justify-between items-baseline">
              <span className="text-xs font-black text-gray-900 uppercase tracking-wide">
                Total Allocation
              </span>
              <span className="text-xl font-black text-indigo-600 tracking-tight">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="block text-center w-full bg-gray-900 hover:bg-indigo-600 text-white font-bold text-xs py-3.5 rounded-2xl shadow-sm transition-all duration-200 tracking-wide hover:-translate-y-0.5"
            >
              Proceed to Secure Checkout ➔
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
