import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function POST(req) {
  await dbConnect();

  try {
    // Get auth token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const body = await req.json();
    const { shippingDetails, items, totalAmount } = body;

    console.log("Order Request Body:", {
      shippingDetails,
      items,
      totalAmount,
      decoded,
    });

    // 🛡️ 1. Validation Checks
    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: "Transaction aborted. Item payload stream is empty." },
        { status: 400 },
      );
    }

    // 🔄 2. Re-map items array to fit the structural model guidelines precisely
    const formattedItems = [];
    
    for (const item of items) {
      console.log("Processing item:", item);
      
      // Get product ID
      let productId = item._id || item.productId || item.id;
      if (!productId) {
        console.error("No product ID found for item:", item);
        continue;
      }
      
      // Fetch product from DB to get vendorId
      const product = await Product.findById(productId);
      if (!product) {
        console.error("Product not found for ID:", productId);
        continue;
      }
      
      console.log("Found product:", product.title, "with vendorId:", product.vendorId);
      
      // Get correct vendorId from product
      let vendorId = product.vendorId;
      if (typeof vendorId === 'string') {
        vendorId = new mongoose.Types.ObjectId(vendorId);
      }
      
      // Convert productId to ObjectId
      if (typeof productId === 'string') {
        productId = new mongoose.Types.ObjectId(productId);
      }

      formattedItems.push({
        productId,
        title: item.title || product.title || 'Unknown Product',
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || product.price || 0,
        vendorId,
      });
    }

    console.log("Final formatted items with vendorId:", formattedItems);

    // 📦 3. Create structural instance matching schema parameters
    let newOrder;
    try {
      const orderData = {
        userId: decoded.id,
        items: formattedItems,
        totalAmount: Number(totalAmount),
        shippingAddress: {
          fullName: shippingDetails.name,
          phone: shippingDetails.phone,
          city: shippingDetails.city || "Karachi Node",
          address: shippingDetails.address,
        },
        paymentStatus: "Pending",
        orderStatus: "Processing",
      };
      console.log("Creating order with data:", orderData);
      newOrder = await Order.create(orderData);
      console.log("Order created successfully:", newOrder);
    } catch (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json(
        {
          success: false,
          message: "Order creation failed",
          error: orderError.message,
          details: orderError.errors,
        },
        { status: 400 },
      );
    }

    // 📉 4. Real-time Inventory Stock Deduct Engine
    for (const item of formattedItems) {
      try {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      } catch (err) {
        console.log("Could not update product stock:", err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order pipeline integrated into Atlas cluster successfully.",
        orderId: newOrder._id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Database Order Routing System Failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Critical pipeline failure.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
