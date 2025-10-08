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
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`http://localhost:5000/cart/remove/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to remove item");

      fetchCart(); // Update UI
    } catch (err) {
      alert(err.message);
    }
  };

  const getTotal = () =>
    cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart 🛒</h2>
      {cart.length === 0 ? (
        <p className="empty">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.product._id}>
                <div className="cart-details">
                  <h3>{item.product.name}</h3>
                  <p>{item.product.description}</p>
                  <p className="price">${item.product.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="cart-actions">
                  <button onClick={() => removeFromCart(item.product._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ${getTotal().toFixed(2)}</h3>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}
