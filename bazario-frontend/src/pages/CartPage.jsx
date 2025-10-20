import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CartPage.css";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");
  const backend = "http://localhost:5000";
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${backend}/cart/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
    
      setCart(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.error(err);
      setCart([]);
    }
  };

  const removeItem = async (productId) => {
    try {
      if (!productId) return; 
      const res = await fetch(`${backend}/cart/remove/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const total = cart.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  );

  // Filter out any null products for rendering
  const validCart = cart.filter((i) => i.product);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {validCart.length === 0 ? (
        <p className="empty">🛍️ Your cart is empty.</p>
      ) : (
        <div className="cart-grid">
          <div className="cart-items">
            {validCart.map((item) => (
              <div className="cart-card" key={item.product._id}>
                <img
                  src={
                    item.product.imageUrl
                      ? `${backend}${item.product.imageUrl}`
                      : `https://picsum.photos/seed/${item.product.name}/200/200`
                  }
                  alt={item.product.name || "Product image"}
                />
                <div className="cart-details">
                  <h3>{item.product.title || "Deleted product"}</h3>
                  <p>{item.product.price || 0} krones</p>
                  <p>Qty: {item.quantity}</p>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p>Total: {total.toFixed(2)} Krones</p>
            <button className="checkout-btn" onClick={() => navigate("/checkout")}>
                Proceed to Checkout
                </button>
          </div>
        </div>
      )}
    </div>
  );
}
