"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function VendorLayout({ children }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  // Navigation Links Matrix
  const navItems = [
    { label: "Dashboard Hub", path: "/vendor", icon: "📊" },
    { label: "Launch Product", path: "/vendor/add-product", icon: "📦" },
    { label: "Manage Inventory", path: "/vendor/manage-products", icon: "⚙️" },
    { label: "View Orders", path: "/vendor/orders", icon: "📋" },
  ];

  const handleLogoutClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Vendor logout initiated...");
    await logout();
  };
  return (
    <div className="flex min-h-screen bg-gray-50/50 text-gray-900 antialiased font-sans w-full">
      {/* 🧭 LEFT SIDEBAR CONTROL PANEL */}
      <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col justify-between fixed h-full border-r border-gray-800 shadow-xl z-20">
        <div className="p-6 space-y-8">
          {/* BRAND SIGNATURE */}
          <div className="border-b border-gray-800 pb-5">
            <span className="text-[9px] bg-indigo-500 text-white font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
              Merchant Node
            </span>
            <h2 className="text-lg font-black tracking-tight text-white mt-2.5">
              E-MARKET<span className="text-indigo-400">X</span>
            </h2>
          </div>

          {/* SIDEBAR NAVIGATION LINKS */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "text-gray-400 hover:bg-gray-800/60 hover:text-gray-200"
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* LOGOUT & USER PROFILE NODE */}
        <div className="p-4 border-t border-gray-800 bg-gray-950/40 space-y-3">
          <div className="px-2">
            <p className="text-xs font-black text-gray-200 truncate">
              {user?.name || "Merchant Operator"}
            </p>
            <p className="text-[10px] text-gray-500 font-medium truncate">
              {user?.email || "node@vendor.io"}
            </p>
          </div>
          <button
            onClick={handleLogoutClick}
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold text-xs py-2.5 rounded-xl transition duration-150 cursor-pointer layout-logout-trigger"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* 💻 RIGHT SIDE DYNAMIC CONTENT VIEWPORT */}
      <div className="flex-grow pl-64 w-full">
        <main className="p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
