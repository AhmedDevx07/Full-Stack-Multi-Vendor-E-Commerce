"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    phone: "",
  });

  // Safe Client Mount Cycle - Check login and cart
  useEffect(() => {
    if (loading) return; // Wait for auth to load

    // If not logged in, redirect to login
    if (!user) {
      toast.error("Please login to proceed with checkout");
      router.push("/login");
      return;
    }

    const cachedCart = JSON.parse(localStorage.getItem("ecom_cart")) || [];
    if (cachedCart.length === 0) {
      router.push("/products");
    } else {
      setCart(cachedCart);
      setMounted(true);
    }
  }, [router, user, loading]);

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (
      !shippingDetails.name ||
      !shippingDetails.address ||
      !shippingDetails.phone
    ) {
      toast.error("Please fill in all shipping parameters!");
      return;
    }

    setIsSubmitting(true);

    try {
      // 🌟 LIVE BACKEND CONNECTIVITY PIPELINE
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ecom_token")}`,
        },
        body: JSON.stringify({
          shippingDetails,
          items: cart,
          totalAmount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Order logged live successfully!", {
          description: `Order ID: ${data.orderId || "Processed"}`,
        });

        // Wipe local transaction matrix
        localStorage.removeItem("ecom_cart");

        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        throw new Error(data.message || "Order submission rejected.");
      }
    } catch (err) {
      console.error("Checkout crash error:", err);
      toast.error(err.message || "Checkout validation operation aborted");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="p-6 max-w-4xl mx-auto font-sans min-h-screen flex items-center justify-center bg-gray-50/30">
        <div className="text-center animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded-xl w-40 mx-auto"></div>
          <div className="h-9 bg-gray-200 rounded-2xl w-72 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans min-h-screen bg-gray-50/30 mt-6 antialiased">
      {/* HEADER SECTION */}
      <div className="mb-10 border-b border-gray-100 pb-5">
        <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
          Transactional Layer
        </span>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-2">
          Secure Settlement Terminal
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* LEFT CONTAINER: SHIPPING FORM */}
        <form
          onSubmit={handlePlaceOrder}
          className="space-y-5 bg-white border border-gray-100 p-6 rounded-3xl shadow-sm"
        >
          <div>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">
              Shipping Telemetry
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Specify destination routing parameters for item fulfillment.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                Consignee Name
              </label>
              <input
                type="text"
                placeholder="e.g. Muhammad Ahmed"
                required
                value={shippingDetails.name}
                onChange={(e) =>
                  setShippingDetails({
                    ...shippingDetails,
                    name: e.target.value,
                  })
                }
                className="w-full text-xs font-bold border border-gray-200/80 rounded-xl p-3 bg-gray-50/50 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                Delivery Physical Address
              </label>
              <input
                type="text"
                placeholder="Street, Sector, Karachi, Pakistan"
                required
                value={shippingDetails.address}
                onChange={(e) =>
                  setShippingDetails({
                    ...shippingDetails,
                    address: e.target.value,
                  })
                }
                className="w-full text-xs font-bold border border-gray-200/80 rounded-xl p-3 bg-gray-50/50 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                Mobile Phone Line
              </label>
              <input
                type="tel"
                placeholder="+92 3xx xxxxxxx"
                required
                value={shippingDetails.phone}
                onChange={(e) =>
                  setShippingDetails({
                    ...shippingDetails,
                    phone: e.target.value,
                  })
                }
                className="w-full text-xs font-bold border border-gray-200/80 rounded-xl p-3 bg-gray-50/50 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-4 rounded-2xl transition shadow-sm tracking-wide flex items-center justify-center gap-2 ${
              isSubmitting ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting
              ? "Processing Matrix Drop..."
              : "Finalize Order & Dispatch ➔"}
          </button>
        </form>

        {/* RIGHT CONTAINER: ITEMS PREVIEW CARD */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-5 shadow-sm sticky top-24">
          <h3 className="font-black text-xs text-gray-900 uppercase tracking-wider border-b border-gray-50 pb-3">
            Checkout Items Matrix
          </h3>

          <div className="max-h-64 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {cart.map((item, index) => (
              <div
                key={item._id || index}
                className="flex justify-between items-center text-xs font-semibold bg-gray-50/50 p-3 rounded-xl border border-gray-100/40"
              >
                <div className="truncate max-w-[200px] flex flex-col">
                  <span className="truncate text-gray-800 font-bold">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    Quantity:{" "}
                    <span className="text-indigo-600 font-extrabold">
                      {item.quantity}
                    </span>
                  </span>
                </div>
                <span className="text-gray-900 font-black">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
            <span className="text-xs font-black text-gray-900 uppercase tracking-wide">
              Aggregated Sum
            </span>
            <span className="text-xl font-black text-indigo-600 tracking-tight">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
