import { useState } from "react";
import { loginUser } from "../services/api";

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
        localStorage.setItem("token", data.token);

        // Navigate by role landing
        if (data.landing === "/admin") {
          window.location.href = "/admin";
        } else if (data.landing === "/employee-manager") {
          window.location.href = "/employee-manager";
        } else {
          window.location.href = "/";
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
