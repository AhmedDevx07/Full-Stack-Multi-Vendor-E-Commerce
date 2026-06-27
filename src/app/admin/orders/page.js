"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("ecom_token");
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.orderStatus?.toLowerCase() === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-mono text-[10px] tracking-wider text-indigo-600 uppercase font-bold">
            Loading Order Stream...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Order Management Hub
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Monitor and manage all customer orders in the system
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "processing", "shipped", "delivered", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                filter === status
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
            <p className="text-sm text-gray-400 font-medium">
              No orders found for this filter
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Order ID */}
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    Order ID
                  </p>
                  <p className="text-xs font-black text-gray-900 mt-1">
                    {order._id?.slice(-8)}
                  </p>
                </div>

                {/* Customer Info */}
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    Customer
                  </p>
                  <p className="text-xs font-bold text-gray-900 mt-1">
                    {order.shippingAddress?.fullName || "N/A"}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {order.shippingAddress?.phone || "N/A"}
                  </p>
                </div>

                {/* Items Count */}
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    Items
                  </p>
                  <p className="text-xs font-black text-gray-900 mt-1">
                    {order.items?.length || 0} items
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    ${order.totalAmount?.toFixed(2)}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    Status
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full mt-1 inline-block ${
                      order.orderStatus === "completed" || order.orderStatus === "delivered"
                        ? "bg-emerald-100 text-emerald-700"
                        : order.orderStatus === "pending" || order.orderStatus === "processing"
                          ? "bg-amber-100 text-amber-700"
                          : order.orderStatus === "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.orderStatus || "Processing"}
                  </span>
                </div>

                {/* Date */}
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    Date
                  </p>
                  <p className="text-xs font-bold text-gray-900 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Details Section */}
              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Shipping Address
                </p>
                <p className="text-xs text-gray-600">
                  {order.shippingAddress?.address || "No address provided"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
