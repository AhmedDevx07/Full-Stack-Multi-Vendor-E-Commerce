import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

// Admin handles approval updates
export async function PUT(req) {
  try {
    await dbConnect();
    const { productId, status } = await req.json(); // status will be "approved" or "rejected"

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { isApproved: status },
      { new: true }
    );

    return NextResponse.json({ message: `Product status updated to ${status}`, updatedProduct }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error during approval", error: error.message }, { status: 500 });
  }
}

// Admin gets ALL products (including pending ones)
export async function GET(req) {
  try {
    await dbConnect();
    const products = await Product.find({}).populate("vendorId", "name");
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch admin product list" }, { status: 500 });
  }
}

// Is function ko purani file ke bilkul niche export default ke upar append kar dein:

// 3. DELETE: Admin forces removal of any product from global catalog
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json({ message: "Missing target asset ID mapping" }, { status: 400 });
    }

    await Product.findByIdAndDelete(productId);
    return NextResponse.json({ message: "Product asset forcefully purged by administration node" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Admin forced delete crashed", error: error.message }, { status: 500 });
  }
}