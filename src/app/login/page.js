"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
export default function AuthPage() {
  const { login, registerUser } = useAuth();
  const [activeTab, setActiveTab] = useState("login"); // login | signup
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === "login") {
        // Use login function from AuthContext
        const result = await login(formData.email, formData.password);
        if (!result.success) {
          throw new Error(result.error);
        }
        toast.success("Session established!");
      } else {
        // Use registerUser function
        const result = await registerUser(
          formData.name,
          formData.email,
          formData.password,
          formData.role,
        );
        if (!result.success) {
          throw new Error(result.error);
        }
        toast.success("Account created successfully! Please login.");
        setActiveTab("login");
      }
    } catch (err) {
      toast.error(err.message || "Authentication layer aborted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 flex items-center justify-center p-6 antialiased font-sans">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6">

        {/* Back to Home Button */}
        <div>
          <Link href="/" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition">
            ← Back to Home
          </Link>
        </div>

        {/* TOP BRAND EMBLEM */}
        <div className="text-center">
          <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            Identity Gateway
          </span>
          <h1 className="text-xl font-black text-gray-900 tracking-tight mt-3">
            {activeTab === "login" ? "Sign In" : "Create Account"}
          </h1>
        </div>

        {/* INTERACTIVE TOGGLE TABS */}
        <div className="grid grid-cols-2 bg-gray-100/60 p-1.5 rounded-xl border border-gray-100">
          <button
            onClick={() => setActiveTab("login")}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
          >
            Secure Login
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
          >
            Register Base
          </button>
        </div>

        {/* INPUT FIELDS MATRIX */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {activeTab === "signup" && (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
                Entity Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full text-xs font-semibold border border-gray-200/80 rounded-xl p-3 bg-gray-50/50 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
              Network Email
            </label>
            <input
              type="email"
              placeholder="name@domain.com"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full text-xs font-semibold border border-gray-200/80 rounded-xl p-3 bg-gray-50/50 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
              Security Key Pass
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full text-xs font-semibold border border-gray-200/80 rounded-xl p-3 bg-gray-50/50 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {activeTab === "signup" && (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
                Account Role Designation
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full text-xs font-bold border border-gray-200/80 rounded-xl p-3 bg-gray-50/50 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
              >
                <option value="customer">Standard Buyer</option>
                <option value="vendor">Merchant Vendor</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-indigo-600 text-white font-bold text-xs py-3.5 rounded-2xl shadow-sm transition-all duration-150 mt-2"
          >
            {loading
              ? "Decrypting Matrix Credentials..."
              : activeTab === "login"
                ? "Verify Identity ➔"
                : "Spawn Account Node ➔"}
          </button>
        </form>
      </div>
    </div>
  );
}
