import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function GET(req) {
  await dbConnect();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("=== Vendor Orders Debug ===");
    console.log("Vendor ID:", decoded.id);
    console.log("Vendor ID type:", typeof decoded.id);

    // First get all vendor's products to get their IDs
    const vendorProducts = await Product.find({
      $or: [
        { vendorId: new mongoose.Types.ObjectId(decoded.id) },
        { vendorId: decoded.id },
      ],
    });
    console.log("Vendor products count:", vendorProducts.length);
    console.log("Vendor product IDs:", vendorProducts.map(p => p._id.toString()));

    // Get all orders
    const allOrders = await Order.find().sort({ createdAt: -1 });
    console.log("All orders in DB:", allOrders.length);
    allOrders.forEach((order, idx) => {
      console.log(`Order ${idx + 1} ID:`, order._id.toString());
      console.log(`Order ${idx + 1} items:`, order.items.map(i => ({ productId: i.productId?.toString(), vendorId: i.vendorId?.toString() })));
    });

    // Get all orders that have at least one item from this vendor's products
    const vendorProductIds = vendorProducts.map(p => new mongoose.Types.ObjectId(p._id));
    const vendorProductIdsStr = vendorProducts.map(p => p._id.toString());

    const orders = await Order.find({
      $or: [
        { "items.productId": { $in: vendorProductIds } },
        { "items.productId": { $in: vendorProductIdsStr } },
        { "items.vendorId": new mongoose.Types.ObjectId(decoded.id) },
        { "items.vendorId": decoded.id },
      ],
    }).sort({ createdAt: -1 });

    console.log("Found vendor orders count:", orders.length);

    // For each order, only keep items that belong to this vendor
    const filteredOrders = orders.map((order) => {
      const orderObj = order.toObject();
      
      // Filter items
      orderObj.items = orderObj.items.filter((item) => {
        // Check if item is from this vendor
        const isVendorItem = 
          vendorProductIds.some(vpId => vpId.toString() === item.productId?.toString()) ||
          vendorProductIdsStr.some(vpId => vpId === item.productId?.toString()) ||
          (item.vendorId && item.vendorId.toString() === decoded.id.toString());
        
        console.log(`Checking item in order ${order._id}:`, { 
          productId: item.productId?.toString(), 
          vendorId: item.vendorId?.toString(), 
          isVendorItem 
        });
        
        return isVendorItem;
      });

      // Recalculate total
      orderObj.totalAmount = orderObj.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      
      console.log(`Order ${order._id} after filtering: ${orderObj.items.length} items, total: $${orderObj.totalAmount}`);
      return orderObj;
    });

    console.log("Final filtered orders count:", filteredOrders.length);
    return NextResponse.json({ orders: filteredOrders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}
