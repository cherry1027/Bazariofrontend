import { createContext, useState, useEffect } from "react";
import { fetchAPI } from "../api/fetchAPIS.js";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) getUserData();
  }, [token]);

  async function getUserData() {
    try {
      const res = await fetchAPI("/user/getUserData", "GET", null, true);
      setUser(res.user);
    } catch (err) {
      console.error(err);
      logout();
    }
  }

  function login(token) {
    localStorage.setItem("token", token);
    setToken(token);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};