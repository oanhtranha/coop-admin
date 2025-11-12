import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@coop.no");
  const [password, setPassword] = useState("123456");
  const navigate = useNavigate();

  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     alert("Please enter email and password");
  //     return;
  //   }
  //   try {
  //     const res = await api.post("/user/login", { email, password });
  //     console.log(res.data.products);
  //     const token = res.data.token;
  //     localStorage.setItem("token", token);
  //     navigate("/dashboard");
  //   } catch (err: any) {
  //     console.error(err);
  //     alert(err.response?.data?.message || "Login failed");
  //   }
  // };
const handleLogin = async () => {
  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }
  try {
    const res = await api.post("/user/login", { email, password });
    console.log(res.data); // xem dữ liệu trả về
    const token = res.data.token;
    localStorage.setItem("token", token);
    navigate("/dashboard");
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || "Login failed");
  }
};

  return (
  <div
    style={{
      maxWidth: 400,
      margin: "100px auto",
      padding: 20,
      border: "1px solid #ccc",
      borderRadius: 8,
      boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
      backgroundColor: "#fff",
    }}
  >
    <h2 style={{ textAlign: "center", marginBottom: 20 }}>Admin Login</h2>

    <div style={{ marginBottom: 15 }}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 4,
          border: "1px solid #ccc",
          boxSizing: "border-box", // 👈 thêm dòng này
        }}
      />
    </div>

    <div style={{ marginBottom: 15 }}>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 4,
          border: "1px solid #ccc",
          boxSizing: "border-box", // 👈 thêm dòng này
        }}
      />
    </div>

    <button
      onClick={handleLogin}
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 4,
        backgroundColor: "#007bff",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
        border: "none",
        boxSizing: "border-box",
      }}
    >
      Login
    </button>
  </div>
);

}
