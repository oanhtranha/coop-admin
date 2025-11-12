import { useEffect, useState } from "react";
import axios from "axios";

interface ProductFormProps {
  productId?: string;
  onSuccess: () => void;
}

export default function ProductForm({ productId, onSuccess }: ProductFormProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:4000/admin/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const p = res.data.product;
        setName(p.name);
        setCode(p.code);
        setOriginalPrice(p.originalPrice);
        setSalePrice(p.salePrice);
      };
      fetchProduct();
    }
  }, [productId]);

  const handleSubmit = async () => {
    if (!name || !code || !originalPrice) {
      alert("Name, code, and original price are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("code", code);
    formData.append("originalPrice", originalPrice.toString());
    formData.append("salePrice", salePrice.toString());
    if (imageFile) formData.append("image", imageFile);

    const token = localStorage.getItem("token");

    try {
      if (productId) {
        await axios.put(`http://localhost:4000/admin/products/${productId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://localhost:4000/admin/products`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    }
  };

  return (
    <div>
      <input placeholder="Code" value={code} onChange={e => setCode(e.target.value)} />
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input
        type="number"
        placeholder="Original Price"
        value={originalPrice}
        onChange={e => setOriginalPrice(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Sale Price"
        value={salePrice}
        onChange={e => setSalePrice(Number(e.target.value))}
      />
      <input type="file" onChange={e => e.target.files && setImageFile(e.target.files[0])} />
      <button onClick={handleSubmit}>{productId ? "Update" : "Add"} Product</button>
    </div>
  );
}
