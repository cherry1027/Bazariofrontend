import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/products.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
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
      if (!res.ok) return alert(data.message || "Failed to add to cart");
      alert("✅ Added to cart!");
    } catch (err) {
      alert("Something went wrong.");
      console.error(err);
    }
  };

  return (
    <div className="products-container">
      <header className="products-header">
        <h1>Bazario Marketplace</h1>
        <button className="cart-btn" onClick={() => navigate("/cart")}>
          🛒 View Cart
        </button>
      </header>

      <div className="products-grid">
        {products.map((p) => (
          <div className="product-card" key={p._id}>
            <img
              src={`https://picsum.photos/seed/${p._id}/400/400`}
              alt={p.name}
            />
            <div className="product-info">
              <h3>{p.name}</h3>
              <p className="desc">{p.description}</p>
              <p className="price">{p.price} krones</p>
              <button className="add-btn" onClick={() => addToCart(p._id)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
