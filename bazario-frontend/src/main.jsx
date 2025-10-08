import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes,Route} from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProductsPage from "./pages/Products.jsx";
import CartPage from "./pages/CartPage.jsx";
import SellerDashboard from "./pages/Sellerdashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import "./styles/global.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/Cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
