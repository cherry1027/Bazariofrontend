import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../api/fetchAPIS";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await fetchAPI("/auth/register", "POST", { name, email, password, role });
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <br />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
