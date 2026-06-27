import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// 1. GET: Saare products ko fetch karne ke liye (Homepage ya Shop page ke liye)
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({ isApproved: "approved", isActive: true }).populate("vendorId", "name email");
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}