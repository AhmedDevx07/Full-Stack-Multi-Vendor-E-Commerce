"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("ecom_token");
      const res = await fetch("/api/vendor/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("ecom_token");
      const res = await fetch(`/api/vendor/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success(`Order ${status} successfully!`);
        fetchOrders();
      } else {
        toast.error("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    }
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.orderStatus?.toLowerCase() === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-mono text-[10px] tracking-wider text-indigo-600 uppercase font-bold">
            Syncing Order Stream...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-start border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Vendor Order Management
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your customer orders and update statuses
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    Order ID
                  </p>
                  <p className="text-xs font-black text-gray-900 mt-1">
                    {order._id?.slice(-8)}
                  </p>
                </div>

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

                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    Your Total
                  </p>
                  <p className="text-xs font-black text-emerald-600 mt-1">
                    ${order.totalAmount?.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {order.items?.length || 0} items
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    Status
                  </p>
                  <div className="mt-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full inline-block ${
                        order.orderStatus === "completed" || order.orderStatus === "delivered"
                          ? "bg-emerald-50 text-emerald-700"
                          : order.orderStatus === "pending" || order.orderStatus === "processing"
                            ? "bg-amber-50 text-amber-700"
                            : order.orderStatus === "shipped"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-red-50 text-red-700"
                      }`}
                    >
                      {order.orderStatus || "Processing"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Your Items
                </p>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <p className="font-bold text-gray-800 text-sm">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-black text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {(order.orderStatus?.toLowerCase() === "pending" ||
                order.orderStatus?.toLowerCase() === "processing") && (
                <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2">
                  <button
                    onClick={() => updateOrderStatus(order._id, "Shipped")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                  >
                    Mark as Shipped
                  </button>
                  <button
                    onClick={() => updateOrderStatus(order._id, "Completed")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => updateOrderStatus(order._id, "Cancelled")}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                  >
                    Cancel Order
                  </button>
                </div>
              )}

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
