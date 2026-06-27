import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// 1. GET: Saare Vendors ki list nikalne ke liye
export async function GET(req) {
  try {
    await dbConnect();

    // Admin Secure Guard
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized: Missing token" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden: Admin access only" }, { status: 403 });
    }

    // Role 'vendor' waale saare users find karein
    const vendors = await User.find({ role: "vendor" }).select("-password").sort({ createdAt: -1 });
    return NextResponse.json(vendors, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Admin Vendor Stream Error", error: error.message }, { status: 500 });
  }
}

// 2. DELETE: Kisi Vendor account ko block/delete karne ke liye aur uske products safaya karne ke liye
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("id");

    if (!vendorId) {
      return NextResponse.json({ message: "Missing vendor asset identification reference" }, { status: 400 });
    }

    // Vendor delete karein
    await User.findByIdAndDelete(vendorId);
    // Cascade Delete: Us vendor ke saare products bhi market se saaf kar dein
    await Product.deleteMany({ vendorId });

    return NextResponse.json({ message: "Vendor and their product catalog purged successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Vendor purge action failed", error: error.message }, { status: 500 });
  }
}