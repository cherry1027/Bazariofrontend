import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const role = data.user.role || "buyer";

      if (role === "seller") {
        navigate("/seller");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };


  return (
    <div className="login-container">
      <div className="login-card">
        <h2>
          Welcome Back to <span className="brand">Bazario</span>
        </h2>
        <p className="subtitle">Sign in to continue shopping</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <p className="signup-text">
          Don’t have an account?{" "}
          <span className="link" onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
