import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();

    // Verify token and admin role
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized: Missing token" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Strict Admin check
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden: Admin access only" },
        { status: 403 },
      );
    }

    // Fetch all orders with sorting
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .lean();

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders", error: error.message },
      { status: 500 },
    );
  }
}
