"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Dark Overlay Background */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between rounded-l-3xl border-l border-gray-100">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-black text-gray-900">Your Basket</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 font-bold text-xl"
            >
              ✕
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-gray-400 text-sm font-medium">
                Your cart is empty.
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-3 bg-gray-50 border border-gray-100 rounded-2xl items-center relative group"
                >
                  <img
                    src={item.images?.[0]}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-xl border bg-white"
                  />

                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-sm line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-indigo-600 font-extrabold mt-0.5">
                      ${item.price}
                    </p>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2 bg-white border rounded-lg w-fit px-1 py-0.5 shadow-sm">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="px-1.5 text-gray-500 hover:text-indigo-600 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold px-1 text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="px-1.5 text-gray-500 hover:text-indigo-600 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xs transition duration-150"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Total */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-bl-3xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-gray-500">
                  Subtotal
                </span>
                <span className="text-xl font-black text-gray-900">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-2xl shadow-md transition duration-200"
              >
                Proceed to Secure Checkout ➔
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
