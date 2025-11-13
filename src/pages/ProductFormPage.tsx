import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import axios from "axios";
import React from "react";

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [product, setProduct] = useState({
    code: "",
    name: "",
    description: "",
    originalPrice: "",
    salePrice: "",
  });

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/admin/products/${id}`);
        const p = res.data.product;
        setProduct({
          code: p.code || "",
          name: p.name || "",
          description: p.description || "",
          originalPrice: p.originalPrice?.toString() || "",
          salePrice: p.salePrice?.toString() || "",
        });
        if (p.image) {
          setPreview(p.image);
          setImageUrl(p.image);
        }
      } catch (err) {
        console.error("Error loading product:", err);
        alert("Failed to load product data.");
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 500 * 1024;
    if (file.size > maxSize) {
      alert("Image too large. Please choose one under 500KB.");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", `${UPLOAD_PRESET}`);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
      const res = await axios.post(cloudinaryUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = res.data.secure_url;
      setImageUrl(uploadedUrl);
    } catch (err: any) {
      console.error("Cloudinary upload error:", err);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!product.code || !product.name || !product.originalPrice) {
      alert("Code, Name and Original Price are required.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...product,
        imageUrl: imageUrl || null,
      };

      if (id) {
        await api.put(`/admin/products/${id}`, payload);
      } else {
        await api.post(`/admin/products`, payload);
      }

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Error saving product:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 30,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        backgroundColor: "#fff",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 25, color: "#333" }}>
        {id ? "Update Product" : "Add New Product"}
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <div>
          <label style={{ fontWeight: 500 }}>Product Code</label>
          <input
            name="code"
            value={product.code}
            onChange={handleChange}
            placeholder="Enter product code"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              marginTop: 5,
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 500 }}>Product Name</label>
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Enter product name"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              marginTop: 5,
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 500 }}>Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Enter product description"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              marginTop: 5,
              minHeight: 80,
            }}
          />
        </div>

        {/* ✅ Original and Sale Price now stacked vertically */}
        <div>
          <label style={{ fontWeight: 500 }}>Original Price</label>
          <input
            type="number"
            name="originalPrice"
            value={product.originalPrice}
            onChange={handleChange}
            placeholder="Enter original price"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              marginTop: 5,
              marginBottom: 15,
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 500 }}>Sale Price</label>
          <input
            type="number"
            name="salePrice"
            value={product.salePrice}
            onChange={handleChange}
            placeholder="Enter sale price"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              marginTop: 5,
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 500 }}>Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginTop: 8 }}
          />
          {uploading && <p style={{ color: "orange" }}>Uploading image...</p>}
          {preview && (
            <img
              src={preview}
              alt="preview"
              style={{
                width: 150,
                height: 150,
                marginTop: 10,
                borderRadius: 10,
                objectFit: "cover",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            />
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 25 }}>
          <button
            onClick={handleSubmit}
            disabled={loading || uploading}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              cursor: loading || uploading ? "not-allowed" : "pointer",
              transition: "0.2s",
            }}
          >
            {loading
              ? "Saving..."
              : uploading
              ? "Uploading..."
              : id
              ? "Update Product"
              : "Add Product"}
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
