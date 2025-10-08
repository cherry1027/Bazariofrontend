import { useEffect, useState } from "react";
import "../styles/CartPage.css";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/cart/", {
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
      const res = await fetch(
        `http://localhost:5000/cart/remove/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const total = cart.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p className="empty">🛍️ Your cart is empty.</p>
      ) : (
        <div className="cart-grid">
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-card" key={item.product._id}>
                <img
                  src={`https://picsum.photos/seed/${item.product._id}/200/200`}
                  alt={item.product.name}
                />
                <div className="cart-details">
                  <h3>{item.product.name}</h3>
                  <p>${item.product.price}</p>
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
            <p>Total: ${total.toFixed(2)}</p>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}
