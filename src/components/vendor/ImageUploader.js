"use client";

import { useState } from "react";

export default function ImageUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Temporary browser preview
    }
  };

  const handleUploadPipeline = async () => {
    if (!file) return alert("Pehle aik product image select karein!");

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        // Secure URL wapis parent component (Product Form state) ko send karein
        onUploadSuccess(data.url);
        alert("Image uploaded successfully onto Cloudinary servers!");
      } else {
        alert(data.message || "Upload operation failed.");
      }
    } catch (error) {
      console.error("Frontend file pipeline failure:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6 max-w-xl">
      <label className="block text-xs font-black uppercase text-gray-400 tracking-wider mb-2">
        Product Assets CDN Pipeline
      </label>

      <div className="flex items-center gap-4">
        {/* Native hidden file picker with clean glassmorphic label */}
        <label className="cursor-pointer bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition duration-150">
          Choose File
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>

        {file && (
          <span className="text-xs text-gray-400 font-mono truncate max-w-[200px]">
            {file.name}
          </span>
        )}
      </div>

      {/* Real-time reactive layout buffer state */}
      {preview && (
        <div className="mt-4 relative border border-gray-50 rounded-xl overflow-hidden w-32 h-32 bg-gray-50">
          <img src={preview} alt="Upload asset preview" className="w-full h-full object-cover" />
        </div>
      )}

      {file && (
        <button
          type="button"
          disabled={uploading}
          onClick={handleUploadPipeline}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition duration-150 disabled:opacity-50"
        >
          {uploading ? "Pushing Image Stream..." : "Deploy Image onto Cloudinary"}
        </button>
      )}
    </div>
  );
}