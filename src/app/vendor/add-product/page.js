"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    images: [],
    description: "",
    category: "electronics",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const uploadFormData = new FormData(); // Renamed to avoid conflict
      uploadFormData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({
          // Use functional update
          ...prev,
          images: [...prev.images, data.url],
        }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image!");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.stock) {
      return toast.error("Please fill all the mandatory fields!");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("ecom_token");

      const res = await fetch("/api/vendor/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          price: Number(formData.price),
          stock: Number(formData.stock),
          images: formData.images,
          description: formData.description,
          category: formData.category,
        }),
      });

      if (res.ok) {
        toast.success("Product submitted! Waiting for admin approval.");
        router.push("/vendor");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to add product.");
      }
    } catch (error) {
      toast.error(error.message || "Internal error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 w-full">
      <div>
        <Link
          href="/vendor"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm space-y-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            Add New Product
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Add your product, it will be visible after admin approval.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">
              Product Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full text-xs bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 font-medium transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full text-xs bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 font-medium transition"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="25"
                className="w-full text-xs bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 font-medium transition"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full text-xs bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 font-bold tracking-tight text-gray-700 transition"
              required
            >
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing & Apparel</option>
              <option value="accessories">Accessories</option>
              <option value="automotive">Automotive</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">
              Product Images
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Uploaded image ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-xl border border-gray-100"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-rose-600 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product..."
              className="w-full text-xs bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 font-medium transition resize-none"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black text-xs py-3.5 rounded-xl transition shadow-sm tracking-widest uppercase"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
