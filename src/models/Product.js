import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    images: {
      type: [String], // Array of image URLs
      required: [true, "At least one product image is required"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
    },
    stock: {
      type: Number,
      required: [true, "Product stock count is required"],
      default: 0, // Real-time stock update ke liye yeh zaroori hai
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Yeh user table se link karega jiska role 'vendor' ho
      required: true,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    // src/models/Product.js ke andar:
    isApproved: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // 🌟 NEW FIELD: Product ko temporarily disable ya enable karne ke liye
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
