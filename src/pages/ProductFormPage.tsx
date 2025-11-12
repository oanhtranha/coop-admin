import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [product, setProduct] = useState({
    code: "",
    name: "",
    description: "",
    originalPrice: "",
    salePrice: "",
  });

  // Load product khi update
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:4000/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const p = res.data.product;
        setProduct({
          code: p.code || "",
          name: p.name || "",
          description: p.description || "",
          originalPrice: p.originalPrice?.toString() || "",
          salePrice: p.salePrice?.toString() || "",
        });
        setPreview(p.image ? `http://localhost:4000${p.image}` : null);
      } catch (err) {
        console.error("❌ Error loading product:", err);
        alert("Failed to load product.");
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!product.code || !product.name || !product.originalPrice) {
      alert("Code, Name and Original Price are required");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("code", product.code);
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("originalPrice", product.originalPrice);
      formData.append("salePrice", product.salePrice);
      if (selectedFile) formData.append("image", selectedFile);

      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (id) {
        await axios.put(`http://localhost:4000/admin/products/${id}`, formData, { headers });
        alert("✅ Product updated!");
      } else {
        await axios.post(`http://localhost:4000/admin/products`, formData, { headers });
        alert("✅ Product added!");
      }
      navigate("/dashboard");
    } catch (err: any) {
      console.error("❌ Error saving product:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 600,
      margin: "20px auto",
      padding: 20,
      border: "1px solid #ccc",
      borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        {id ? "Update Product" : "Add New Product"}
      </h1>

      <label>Product Code</label>
      <input
        name="code"
        value={product.code}
        onChange={handleChange}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
        placeholder="Enter product code"
      />

      <label>Product Name</label>
      <input
        name="name"
        value={product.name}
        onChange={handleChange}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
        placeholder="Enter product name"
      />

      <label>Description</label>
      <textarea
        name="description"
        value={product.description}
        onChange={handleChange}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
        placeholder="Enter description"
      />

      <label>Original Price</label>
      <input
        type="number"
        name="originalPrice"
        value={product.originalPrice}
        onChange={handleChange}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <label>Sale Price</label>
      <input
        type="number"
        name="salePrice"
        value={product.salePrice}
        onChange={handleChange}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <label>Product Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ marginBottom: 10 }}
      />
      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{ width: 150, marginBottom: 10, borderRadius: 8, objectFit: "cover" }}
        />
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          {loading ? "Saving..." : id ? "Update Product" : "Add Product"}
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
