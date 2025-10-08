import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SellerDashboard.css";

export default function SellerDashboard() {
  const [orders, setOrders] = useState([]);
  const [product, setProduct] = useState({ name: "", price: "", description: "" });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const fetchSellerOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/orders/seller", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add product");
      setMessage("✅ Product added successfully!");
      setProduct({ name: "", price: "", description: "" });
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <h2>Seller Dashboard</h2>
        <button onClick={() => navigate("/products")}>View Store</button>
      </div>

      <div className="add-product-section">
        <h3>Add New Product</h3>
        {message && <p className="status">{message}</p>}
        <form onSubmit={handleAddProduct}>
          <input
            type="text"
            placeholder="Product name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          />
          <button type="submit">Add Product</button>
        </form>
      </div>

      <div className="orders-section">
        <h3>Orders</h3>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order._id}>
                <strong>Order ID:</strong> {order._id} <br />
                <strong>Total:</strong> ${order.total} <br />
                <strong>Status:</strong> {order.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
