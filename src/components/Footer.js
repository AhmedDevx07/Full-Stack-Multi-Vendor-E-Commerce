"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100/80 mt-32 antialiased">
      {/* UPPER HIGH-DENSITY GRID NODE */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-50 pb-12">
          
          {/* BRAND COLUMN */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="text-xl font-black tracking-tight text-indigo-600 block">
              E-MARKET<span className="text-gray-900 font-black">X</span>
            </Link>
            <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-xs">
              Next-generation multi-vendor terminal hub optimized for high-yield digital trade aggregates.
            </p>
          </div>

          {/* MARKETPLACE LINKS MATRIX */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Core Marketplace</h4>
            <ul className="space-y-2 text-xs font-bold text-gray-500">
              <li><Link href="/products" className="hover:text-indigo-600 transition duration-150">Catalog Feed</Link></li>
              <li><Link href="/cart" className="hover:text-indigo-600 transition duration-150">Active Cart</Link></li>
              <li><Link href="/checkout" className="hover:text-indigo-600 transition duration-150">Settlement Node</Link></li>
            </ul>
          </div>

          {/* SYSTEM NETWORK LINKS */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Corporate Sync</h4>
            <ul className="space-y-2 text-xs font-bold text-gray-500">
              <li><Link href="/about" className="hover:text-indigo-600 transition duration-150">About System</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-600 transition duration-150">Comms Relay</Link></li>
              <li><Link href="/login" className="hover:text-indigo-600 transition duration-150">Identity Portal</Link></li>
            </ul>
          </div>

          {/* TECH STACK FOOTPRINT METRIC */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">System Payload</h4>
            <div className="bg-gray-50/70 border border-gray-100 p-3 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">All Systems Nominal</span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">Node Vercel Edge Server Active</p>
            </div>
          </div>

        </div>

        {/* LOWER BASELINE LEGAL FOOTER */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 font-medium text-center sm:text-left">
            © {new Date().getFullYear()} <span className="text-gray-900 font-black">AhmedDevx07</span>. All architecture nodes reserved.
          </p>
          
          <div className="flex gap-6 text-[11px] font-bold text-gray-400">
            <Link href="/" className="hover:text-gray-900 transition">Privacy Pipeline</Link>
            <Link href="/" className="hover:text-gray-900 transition">Terms Matrix</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}