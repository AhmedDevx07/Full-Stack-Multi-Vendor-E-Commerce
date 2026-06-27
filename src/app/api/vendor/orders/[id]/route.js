import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function PUT(req, { params }) {
  const { id } = await params;
  await dbConnect();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { status } = await req.json();

    console.log("=== ORDER UPDATE ===");
    console.log("Order ID from params:", id);
    console.log("Vendor ID:", decoded.id);
    console.log("New status:", status);

    // First get vendor's products
    const vendorProducts = await Product.find({
      $or: [
        { vendorId: new mongoose.Types.ObjectId(decoded.id) },
        { vendorId: decoded.id },
      ],
    });
    const vendorProductIds = vendorProducts.map((p) => p._id.toString());
    console.log("Vendor's products:", vendorProductIds);

    // Find order by ID
    const order = await Order.findById(id);

    if (!order) {
      console.log("ERROR: Order not found!");
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    console.log("Order found! Checking vendor items...");

    // Check if this vendor has any items in this order
    const hasVendorItem = order.items.some((item) => {
      const itemProductId = item.productId?.toString();
      const itemVendorId = item.vendorId?.toString();
      return (
        vendorProductIds.includes(itemProductId) ||
        itemVendorId === decoded.id.toString()
      );
    });

    if (!hasVendorItem) {
      console.log("ERROR: No items belong to this vendor!");
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    console.log("✅ Found vendor items! Updating status...");

    // Update order status
    order.orderStatus = status;
    await order.save();

    console.log("✅ Order updated successfully!");

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating vendor order:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}
