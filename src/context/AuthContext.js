"use client"; // Next.js mein context hamesha client component hota hai

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Page reload par check karein ke user pehle se logged in hai ya nahi
  useEffect(() => {
    const storedUser = localStorage.getItem("ecom_user");
    const storedToken = localStorage.getItem("ecom_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 1. Login Function
  const login = async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // LocalStorage mein save karein
      localStorage.setItem("ecom_token", data.token);
      localStorage.setItem("ecom_user", JSON.stringify(data.user));

      // 🔥 FIX: 'token' ki jagah 'data.token' use kiya taake undefined ka error na aaye
      document.cookie = `ecom_token=${data.token}; path=/; max-age=${60 * 60 * 24};`;

      setUser(data.user);

      // Role ke mutabiq redirect karein
      if (data.user.role === "admin") router.push("/admin");
      else if (data.user.role === "vendor") router.push("/vendor");
      else router.push("/");

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // 2. Register Function
  const registerUser = async (name, email, password, role) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // 3. Logout Function
  const logout = async () => {
    try {
      // First, call the backend logout endpoint to clear the httpOnly cookie
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      // Then clear all local storage
      localStorage.removeItem("ecom_token");
      localStorage.removeItem("ecom_user");
      
      // Also clear any cookies from frontend (just in case)
      document.cookie = "ecom_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "ecom_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      
      // Reset state
      setUser(null);
      
      // Force hard redirect to login page
      window.location.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      
      // Even if backend call fails, still clear local storage and redirect
      localStorage.removeItem("ecom_token");
      localStorage.removeItem("ecom_user");
      document.cookie = "ecom_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, registerUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook taake kisi bhi component mein asani se use ho sake
export function useAuth() {
  return useContext(AuthContext);
}
