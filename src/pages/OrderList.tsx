import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/api";

interface Product {
  id: number;
  name: string;
  code: string;
  salePrice: number;
  originalPrice: number;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: Product;
}

interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  user: { id: number; username: string; email: string };
}

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/admin/orders`);
      setOrders(res.data.orders);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Group orders by status
  const groupOrders = (status: string) =>
    orders.filter(order => order.status === status);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/admin/orders/${orderId}/status`,
        { status: newStatus });
      fetchOrders(); // refresh list
    } catch (error) {
      console.error(error);
    }
  };

  // Styles
  const cardStyle = (status: string) => ({
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    backgroundColor:
      status === "PENDING"
        ? "#FFF8E1"
        : status === "DELIVERING"
        ? "#E1F5FE"
        : "white", // PENDING vàng nhạt, DELIVERING xanh nhạt
  });

  const statusColors: Record<string, string> = {
    PENDING: "#FFEB3B",
    DELIVERING: "#03A9F4",
    DONE: "#4CAF50",
    CANCELLED: "#f44336",
  };

  return (
    <div style={{ maxWidth: 1200, margin: "30px auto", padding: 20 }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>All Orders</h1>

      {["PENDING", "DELIVERING", "DONE", "CANCELLED"].map(status => {
        const grouped = groupOrders(status);
        if (grouped.length === 0) return null;

        return (
          <div key={status} style={{ marginBottom: 40 }}>
            <h2 style={{ color: statusColors[status], marginBottom: 16 }}>
              {status} Orders
            </h2>

            {grouped.map(order => (
              <div key={order.id} style={cardStyle(order.status)}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <strong>Order ID:</strong> {order.id} | <strong>User:</strong>{" "}
                    {order.user.username} ({order.user.email})
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    {order.status === "PENDING" || order.status === "DELIVERING" ? (
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="DELIVERING">DELIVERING</option>
                        <option value="DONE">DONE</option>
                        <option value="CANCELLED">CANCEL</option>
                      </select>
                    ) : (
                      <span>{order.status}</span>
                    )}
                  </div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong>Total:</strong> ${order.totalAmount} |{" "}
                  <strong>Created At:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </div>
                <div>
                  <strong>Items:</strong>
                  <ul>
                    {order.items.map(item => (
                      <li key={item.id}>
                        {item.product.name} x {item.quantity} (${item.price})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default OrderList;
