import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
  
export async function GET(req) {
  try {
    await dbConnect();

    // Verify token
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized: Missing token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Strict Admin check
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden: Admin access only" }, { status: 403 });
    }

    // Execute parallel lookups for extreme efficiency
    const [totalProducts, totalUsers, allOrders] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.find().sort({ createdAt: -1 }),
    ]);

    // Financial math
    const totalSales = allOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    return NextResponse.json({
      totalProducts,
      totalUsers,
      totalOrders: allOrders.length,
      totalSales,
      recentOrders: allOrders.slice(0, 5), // Only pass top 5 recent pipeline items
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Admin Sync Error", error: error.message }, { status: 500 });
  }
}