import React, { useState, useEffect } from "react";
import { registerEmployeeManager, getUsers, deleteUser } from "../services/api";
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
  const [adminName, setAdminName] = useState("");
  const [users, setUsers] = useState([]);

  // load admin + users
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setAdminName(`${user.firstName} ${user.lastName}`);
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
      setMsg(`✅ Employee Manager created: ${data.firstName} ${data.lastName}`);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        rePassword: "",
      });
      loadUsers();
    } else {
      setErr(data?.message || "Failed to register manager");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this manager?")) return;
    try {
      await deleteUser(id);
      loadUsers(); // refresh list after delete
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-wrap">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-info">
          <span className="admin-name">👤 {adminName || "Factory Admin"}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Main grid */}
      <div className="admin-grid">
        {/* Register Form */}
        <section className="card">
          <h2>Register Employee Manager</h2>
          <p className="hint">
            Fill the form to add a new Employee Manager for the project.
          </p>

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

        {/* Managers List */}
        <section className="card">
          <h2>All Employee Managers</h2>
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.firstName} {u.lastName}</td>
                    <td>{u.email}</td>
                    <td>
                      <span style={{ color: "green", fontWeight: "600" }}>
                        ✅ {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(u._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No managers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default AdminLanding;
