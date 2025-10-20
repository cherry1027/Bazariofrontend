import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/orderhistory.css";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const backend = "http://localhost:5000";
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${backend}/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      paid: "#10b981",
      shipped: "#3b82f6",
      delivered: "#059669",
      cancelled: "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  if (loading) {
    return (
      <div className="order-history-container">
        <h2>Loading your orders...</h2>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-history-container">
        <h2>Order History</h2>
        <div className="empty-state">
          <p>📦 You haven't placed any orders yet.</p>
          <button onClick={() => navigate("/products")}>Start Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <header className="order-header">
        <h2>Order History</h2>
        <button onClick={() => navigate("/products")}>Continue Shopping</button>
      </header>

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-header-info">
              <div>
                <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span
                className="order-status"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            <div className="order-items">
              {order.items.map((item, idx) => (
                <div className="order-item" key={idx}>
                  <img
                    src={
                      item.product?.imageUrl
                        ? `${backend}${item.product.imageUrl}`
                        : `https://picsum.photos/seed/${item.product?._id}/80/80`
                    }
                    alt={item.title}
                  />
                  <div className="item-info">
                    <h4>{item.title}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: {item.price} Kr</p>
                  </div>
                  <p className="item-subtotal">
                    {(item.price * item.quantity).toFixed(2)} Kr
                  </p>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="shipping-info">
                <strong>Shipping Address:</strong>
                <p>{order.shippingAddress || "N/A"}</p>
              </div>
              <div className="order-total">
                <h3>Total: {order.totalAmount.toFixed(2)} Kr</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}