import Navbar from "../components/Navbar";
import "../styles/landing.css";

export default function LandingPage() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Shop Smarter with <span>Bazario</span></h1>
          <p>Discover exclusive deals and trusted sellers — all in one place.</p>
          <button>Start Shopping</button>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="featured">
        <h2>Featured Products</h2>
        <div className="product-grid">
          <div className="product-card">
            <img src="/assets/product1.jpg" alt="Product 1" />
            <h3>Wireless Headphones</h3>
            <p>$99</p>
          </div>
          <div className="product-card">
            <img src="/assets/product2.jpg" alt="Product 2" />
            <h3>Smart Watch</h3>
            <p>$129</p>
          </div>
          <div className="product-card">
            <img src="/assets/product3.jpg" alt="Product 3" />
            <h3>Bluetooth Speaker</h3>
            <p>$79</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <h2>About Bazario</h2>
        <p>
          Bazario is your trusted online marketplace built to connect buyers and sellers
          seamlessly. Whether you’re shopping for the latest tech, fashion, or home essentials,
          we bring everything under one digital roof.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Bazario. All Rights Reserved.</p>
      </footer>
    </>
  );
}
