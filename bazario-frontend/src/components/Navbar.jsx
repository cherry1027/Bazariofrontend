import { Link } from "react-router-dom";
import "./../styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">Bazario</Link>
      </div>

      <ul className="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#products">Products</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <div className="nav-actions">
        <Link to="/login" className="nav-btn">Login</Link>
        <Link to="/register" className="nav-btn">Sign Up</Link>
      </div>
    </nav>
  );
}
