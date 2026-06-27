import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";

// 🔐 Helper function: Request headers se token verify karke vendor data extract karne ke liye
async function verifyVendorToken(req) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "vendor") return null;
    return decoded.id; // Returns vendorId
  } catch (err) {
    return null;
  }
}

// 📥 1. GET: Fetch Vendor Specific Catalog Feed
export async function GET(req) {
  await dbConnect();
  const vendorId = await verifyVendorToken(req);

  if (!vendorId) {
    return NextResponse.json(
      { message: "Unauthorized credentials token." },
      { status: 401 },
    );
  }

  try {
    // Sirf is specific vendor ke products nikalenge orders pipeline ke liye
    const vendorProducts = await Product.find({ vendorId }).sort({
      createdAt: -1,
    });
    return NextResponse.json(vendorProducts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Catalog fetch failure stream.", error: error.message },
      { status: 500 },
    );
  }
}

// 📤 2. POST: Add New Product
export async function POST(req) {
  await dbConnect();
  const vendorId = await verifyVendorToken(req);

  if (!vendorId) {
    return NextResponse.json(
      { message: "Unauthorized credentials token." },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    const { title, price, stock, images, description, category } = body;

    if (!title || !price || !category) {
      return NextResponse.json(
        { message: "Missing mandatory product parameters!" },
        { status: 400 },
      );
    }

    const newProduct = await Product.create({
      title,
      price: Number(price),
      stock: Number(stock) || 0,
      images: images || [],
      description: description || "",
      category,
      vendorId,
      isApproved: "pending", // Pending admin approval
      isActive: true,
    });

    return NextResponse.json(
      { message: "Product added successfully!", product: newProduct },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Product creation failed!", error: error.message },
      { status: 500 },
    );
  }
}

// 🔄 3. PUT: Toggle Product Visibility Active/Inactive State
export async function PUT(req) {
  await dbConnect();

  // Note: Request validation and verification layer control check
  try {
    const body = await req.json();
    const { productId, isActive } = body;

    if (!productId) {
      return NextResponse.json(
        { message: "Product missing target node key parameter." },
        { status: 400 },
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { isActive: isActive } },
      { new: true },
    );

    return NextResponse.json(
      { success: true, product: updatedProduct },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Visibility switch operational abort.", error: error.message },
      { status: 500 },
    );
  }
}

// 🗑️ 4. DELETE: Purge Asset Permanently From Database Cluster
export async function DELETE(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID reference query missing." },
        { status: 400 },
      );
    }

    await Product.findByIdAndDelete(productId);
    return NextResponse.json(
      {
        success: true,
        message: "Asset wiped successfully from Atlas cluster nodes.",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Purge process crashed.", error: error.message },
      { status: 500 },
    );
  }
}
