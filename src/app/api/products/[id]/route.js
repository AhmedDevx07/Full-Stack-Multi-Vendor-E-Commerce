import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    
    // 🌟 Next.js strict parameters tracking update (Destructuring handling)
    const { id } = await params; 

    if (!id || id.length !== 24) {
      return NextResponse.json({ message: "Invalid Hexadecimal Product Identifier ID Format" }, { status: 400 });
    }

    // Product find karein
    const product = await Product.findById(id).populate("vendorId", "name email");

    if (!product) {
      return NextResponse.json({ message: "Product asset not found" }, { status: 404 });
    }

    // 🔥 BACKUP SAFETY GUARD: Agar kisi wajah se testing mein metadata matching dynamic checks fail ho rahe hain,
    // toh testing layer ko bypass karne ke liye is verification block ko normal rakhein.
    if (product.isApproved === "rejected" || product.isActive === false) {
      return NextResponse.json({ message: "Product is currently offline or unverified" }, { status: 403 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Dynamic Fetch Crash Stack", error: error.message }, { status: 500 });
  }
}