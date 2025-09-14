import React, { useState, useEffect } from "react";
import {
  registerEmployeeManager,
  getUsers,
  deleteUser,
  updateUser,
} from "../services/api";
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
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // load admin name + users
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
        // ✅ Only employee managers
        const managers = data.filter((u) => u.role === "employeeManager");
        setUsers(managers);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
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
    const res = await deleteUser(id);
    if (res?.message) {
      setMsg(res.message);
      loadUsers();
    } else {
      setErr("Failed to delete user");
    }
  };

  const startEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({ firstName: "", lastName: "", email: "" });
  };

  const saveEdit = async (id) => {
    const res = await updateUser(id, editForm);
    if (res?._id) {
      setMsg("✅ User updated successfully");
      setEditingUser(null);
      loadUsers();
    } else {
      setErr(res?.message || "Failed to update user");
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      {editingUser === u._id ? (
                        <>
                          <input
                            value={editForm.firstName}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                firstName: e.target.value,
                              }))
                            }
                          />
                          <input
                            value={editForm.lastName}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                lastName: e.target.value,
                              }))
                            }
                          />
                        </>
                      ) : (
                        `${u.firstName} ${u.lastName}`
                      )}
                    </td>
                    <td>
                      {editingUser === u._id ? (
                        <input
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              email: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        u.email
                      )}
                    </td>
                    <td>
                      <span style={{ color: "green", fontWeight: "600" }}>
                        ✅ Active
                      </span>
                    </td>
                    <td>
                      {editingUser === u._id ? (
                        <>
                          <button
                            className="btn-edit"
                            onClick={() => saveEdit(u._id)}
                          >
                            Save
                          </button>
                          <button className="btn-cancel" onClick={cancelEdit}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn-edit"
                            onClick={() => startEdit(u)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(u._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No Employee Managers found</td>
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
