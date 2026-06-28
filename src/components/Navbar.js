"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <div className="w-full sticky top-0 z-50 px-4 pt-4 bg-transparent backdrop-blur-sm">
      <header className="bg-white/75 backdrop-blur-xl border border-gray-100/80 px-6 py-3.5 max-w-7xl mx-auto rounded-2xl shadow-sm flex justify-between items-center transition-all duration-300">

        {/* 🌟 Branding Logo */}
        <Link href="/" className="text-xl font-black tracking-tight text-indigo-600 flex items-center gap-1 hover:opacity-90 transition">
          E-MARKET<span className="text-gray-900 font-medium">X</span>
        </Link>

        {/* 🧭 Dynamic Navigation Links (As per your blueprint) */}
        <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-wider font-bold text-gray-500">
          <Link href="/" className="hover:text-indigo-600 transition-colors duration-200">Home</Link>
          <Link href="/products" className="hover:text-indigo-600 transition-colors duration-200">Shop</Link>
          <Link href="/about" className="hover:text-indigo-600 transition-colors duration-200">About</Link>
          <Link href="/contact" className="hover:text-indigo-600 transition-colors duration-200">Contact</Link>

          {/* Portals access indicators inside default viewport context */}
          {user?.role === "vendor" && (
            <Link href="/vendor" className="text-indigo-600 hover:text-indigo-700 bg-indigo-50/60 px-2.5 py-1 rounded-lg text-[11px]">
              Vendor Portal ↗
            </Link>
          )}
          {user?.role === "admin" && (
            <Link href="/admin" className="text-rose-600 hover:text-rose-700 bg-rose-50/60 px-2.5 py-1 rounded-lg text-[11px]">
              Admin Control ↗
            </Link>
          )}
        </nav>

        {/* ⚡ Right Actions Array */}
        <div className="flex items-center gap-5">

          {/* 🛒 Clean Shopping Cart Link & Counter */}
          <Link
            href="/cart"
            className="relative p-2.5 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-xl transition duration-200 block"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-indigo-600 text-white text-[9px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center shadow-sm border border-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* 👤 User Session State Configuration */}
          {user ? (
            <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
              <div className="flex flex-col text-right hidden sm:block">
                <span className="text-[11px] text-gray-400 font-medium block leading-none">Logged in as</span>
                <span className="text-xs font-bold text-gray-800 tracking-tight mt-0.5">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100/80 px-3.5 py-2 rounded-xl transition duration-150"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl transition shadow-sm tracking-wide"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>
    </div>
  );
}