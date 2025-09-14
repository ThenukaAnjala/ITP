// src/pages/Login.jsx
import { useState } from "react";
import { loginUser } from "../services/api";
import "../styles/pages/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(email, password);

      if (data.token) {
        // Save token + user details
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // 🔑 Normalize role (lowercase, remove special chars)
        const role = data.user.role?.toLowerCase();

        if (role === "admin") {
          window.location.href = "/admin";
        } else if (role === "employeemanager") {
          window.location.href = "/employee-manager";
        } else if (role === "inventorymanager") {
          window.location.href = "/inventory-manager";
        } else if (role === "suppliermanager") {
          window.location.href = "/supplier-manager";
        } else if (role === "employee") {
          window.location.href = "/employee";
        } else {
          setError("Role not recognized");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Rubber Factory Login</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
