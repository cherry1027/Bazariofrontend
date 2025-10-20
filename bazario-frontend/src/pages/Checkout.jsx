import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Checkout.css";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardNumber, setCardNumber] = useState("");
  const [error, setError] = useState("");
  
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

  const validCart = cart.filter((i) => i.product);
  const total = validCart.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  );

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!shippingAddress.trim()) {
      setError("Please enter a shipping address");
      return;
    }

    if (validCart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${backend}/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      // Show success and redirect
      alert("🎉 Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (validCart.length === 0) {
    return (
      <div className="checkout-container">
        <h2>Checkout</h2>
        <p className="empty">Your cart is empty. Add some products first!</p>
        <button onClick={() => navigate("/products")}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="checkout-grid">
        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          {validCart.map((item) => (
            <div className="summary-item" key={item.product._id}>
              <img
                src={
                  item.product.imageUrl
                    ? `${backend}${item.product.imageUrl}`
                    : `https://picsum.photos/seed/${item.product._id}/100/100`
                }
                alt={item.product.title}
              />
              <div className="item-details">
                <h4>{item.product.title}</h4>
                <p>
                  {item.quantity} x {item.product.price} Kr
                </p>
              </div>
              <p className="item-total">
                {(item.quantity * item.product.price).toFixed(2)} Kr
              </p>
            </div>
          ))}

          <div className="total-section">
            <h3>Total: {total.toFixed(2)} Kr</h3>
          </div>
        </div>

        {/* Checkout Form */}
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <h3>Shipping Information</h3>
          <div className="form-group">
            <label>Shipping Address *</label>
            <textarea
              placeholder="Enter your full address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
              rows={4}
            />
          </div>

          <h3>Payment Method</h3>
          <div className="form-group">
            <label>
              <input
                type="radio"
                name="payment"
                value="credit_card"
                checked={paymentMethod === "credit_card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit Card
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              PayPal
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="cash_on_delivery"
                checked={paymentMethod === "cash_on_delivery"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
          </div>

          {paymentMethod === "credit_card" && (
            <div className="form-group">
              <label>Card Number (Demo)</label>
              <input
                type="text"
                placeholder="4111 1111 1111 1111"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
              />
              <small>This is a demo. Any card number will work.</small>
            </div>
          )}

          {error && <p className="error">{error}</p>}

          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}