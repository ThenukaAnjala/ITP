import React, { useState } from "react";
import { registerEmployeeManager } from "../services/api";
import "../styles/pages/admin.css";

function AdminLanding() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rePassword: "",
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (form.password !== form.rePassword) {
      setErr("Passwords do not match");
      return;
    }

    setLoading(true);
    const data = await registerEmployeeManager(form);
    setLoading(false);

    if (data && data.id) {
      setMsg(`Employee Manager created: ${data.firstName} ${data.lastName}`);
      setForm({ firstName: "", lastName: "", email: "", password: "", rePassword: "" });
    } else {
      setErr(data?.message || "Failed to register manager");
    }
  };

  return (
    <div className="admin-wrap">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <section className="card">
        <h2>Register Employee Manager</h2>
        <p className="hint">Fill the form to add a new Employee Manager for the project.</p>

        {msg && <div className="ok">{msg}</div>}
        {err && <div className="error">{err}</div>}

        <form className="grid" onSubmit={onSubmit}>
          <div className="field">
            <label>First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={onChange}
              required
            />
          </div>
          <div className="field">
            <label>Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={onChange}
              required
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              minLength={6}
              required
            />
          </div>
          <div className="field">
            <label>Re-Password</label>
            <input
              type="password"
              name="rePassword"
              value={form.rePassword}
              onChange={onChange}
              minLength={6}
              required
            />
          </div>

          <div className="actions">
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Manager"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AdminLanding;
