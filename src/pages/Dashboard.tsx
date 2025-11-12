import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  code: string;
  name: string;
  image?: string;
  description?: string;
  originalPrice: number;
  salePrice: number;
  onSaleFlag: boolean;
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "30px auto", padding: 20 }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>Product Dashboard</h1>
      
      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20, gap: 10 }}>
        <button
          onClick={() => navigate("/product")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
            transition: "background 0.3s",
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#45a049")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#4CAF50")}
        >
          Add New Product
        </button>

        <button
          onClick={() => navigate("/orders")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#FF9800",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
            transition: "background 0.3s",
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fb8c00")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#FF9800")}
        >
          View All Orders
        </button>
      </div>

      {/* Product Table */}
      {products.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: 16 }}>No products yet. Click "Add New Product" to create one.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <thead style={{ backgroundColor: "#f4f4f4" }}>
            <tr>
              <th style={{ padding: 12, borderBottom: "2px solid #ddd" }}>Code</th>
              <th style={{ padding: 12, borderBottom: "2px solid #ddd" }}>Name</th>
              <th style={{ padding: 12, borderBottom: "2px solid #ddd" }}>Image</th>
              <th style={{ padding: 12, borderBottom: "2px solid #ddd" }}>Original Price</th>
              <th style={{ padding: 12, borderBottom: "2px solid #ddd" }}>Sale Price</th>
              <th style={{ padding: 12, borderBottom: "2px solid #ddd" }}>On Sale</th>
              <th style={{ padding: 12, borderBottom: "2px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: "1px solid #eee", transition: "background 0.3s" }}>
                <td style={{ padding: 12 }}>{p.code}</td>
                <td style={{ padding: 12 }}>{p.name}</td>
                <td style={{ padding: 12 }}>
                  {p.image ? (
                    <img
                      src={`http://localhost:4000${p.image}`}
                      alt={p.name}
                      style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
                    />
                  ) : (
                    <span style={{ color: "#888" }}>No Image</span>
                  )}
                </td>
                <td style={{ padding: 12 }}>${p.originalPrice}</td>
                <td style={{ padding: 12 }}>${p.salePrice}</td>
                <td style={{ padding: 12, fontWeight: 600 }}>{p.onSaleFlag ? "Yes" : "No"}</td>
                <td style={{ padding: 12, display: "flex", gap: 8 }}>
                  <button
                    onClick={() => navigate(`/product/${p.id}`)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#2196F3",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
