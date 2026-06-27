import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await dbConnect();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized: Missing token" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get vendor products
    const vendorProducts = await Product.find({
      $or: [
        { vendorId: new mongoose.Types.ObjectId(decoded.id) },
        { vendorId: decoded.id },
      ],
    });
    const productIds = vendorProducts.map(p => p._id.toString());
    const productObjIds = vendorProducts.map(p => new mongoose.Types.ObjectId(p._id));

    console.log("Vendor Stats - Vendor ID:", decoded.id);
    console.log("Vendor Products:", productIds);

    // Get vendor orders
    const vendorOrders = await Order.find({
      $or: [
        { "items.productId": { $in: productObjIds } },
        { "items.productId": { $in: productIds } },
        { "items.vendorId": new mongoose.Types.ObjectId(decoded.id) },
        { "items.vendorId": decoded.id },
      ],
    }).sort({ createdAt: -1 }).limit(5);

    // Calculate stats
    let totalSales = 0;
    let totalOrders = 0;
    let totalProducts = vendorProducts.length;
    let approvedProducts = vendorProducts.filter(p => p.isApproved === "approved").length;

    vendorOrders.forEach(order => {
      let vendorOrderTotal = 0;
      order.items.forEach(item => {
        const itemProductId = item.productId?.toString();
        const itemVendorId = item.vendorId?.toString();
        if (
          productIds.includes(itemProductId) ||
          itemVendorId === decoded.id.toString()
        ) {
          vendorOrderTotal += item.price * item.quantity;
        }
      });
      totalSales += vendorOrderTotal;
      totalOrders++;
    });

    // Format recent orders
    const recentOrders = vendorOrders.map(order => {
      const vendorItems = order.items.filter(item => {
        const itemProductId = item.productId?.toString();
        const itemVendorId = item.vendorId?.toString();
        return productIds.includes(itemProductId) || itemVendorId === decoded.id.toString();
      });
      
      let vendorTotal = 0;
      vendorItems.forEach(item => {
        vendorTotal += item.price * item.quantity;
      });

      return {
        _id: order._id,
        shippingDetails: order.shippingAddress,
        totalAmount: vendorTotal,
        status: order.orderStatus,
        orderStatus: order.orderStatus,
      };
    });

    return NextResponse.json({
      totalSales,
      totalOrders,
      totalProducts,
      approvedProducts,
      recentOrders
    }, { status: 200 });

  } catch (error) {
    console.error("Vendor stats fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch stats", error: error.message },
      { status: 500 },
    );
  }
}
