import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/products.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
    fetchCartCount();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await fetch("http://localhost:5000/cart/", {
        headers: { Authorization: `Bearer ${token}`},
      });
      const data = await res.json();
      setCartCount(data.length);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (productId) => {
    try {
      const res = await fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add to cart");

      alert("✅ Product added to cart!");
      fetchCartCount(); // Update cart count in UI
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="products-page">
      <div className="cart-header">
        <h2>🛒 Available Products</h2>
        <button className="cart-btn" onClick={() => navigate("/cart")}>
          🛒 Cart ({cartCount})
        </button>
      </div>

      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p._id}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p className="price">${p.price}</p>
            <button onClick={() => addToCart(p._id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
