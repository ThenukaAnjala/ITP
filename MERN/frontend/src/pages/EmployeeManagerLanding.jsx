import React, { useState, useEffect } from "react";
import {
  registerUser,
  getUsers,
  deleteUser,
  updateUser,
} from "../services/api";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../services/inventoryApi"; // 👈 Task API
import "../styles/pages/employeeManager.css";

function EmployeeManagerLanding() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rePassword: "",
    role: "employee", // default Rubber Tapper
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // ✅ Task state
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
  });

  // edit state
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    loadUsers();
    loadTasks();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      if (Array.isArray(data)) {
        const filtered = data.filter(
          (u) =>
            u.role === "employee" ||
            u.role === "inventoryManager" ||
            u.role === "supplierManager"
        );
        setUsers(filtered);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    }
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
    const data = await registerUser(form);
    setLoading(false);

    if (data && data.id) {
      setMsg(`✅ ${form.role} created: ${data.firstName} ${data.lastName}`);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        rePassword: "",
        role: "employee",
      });
      loadUsers();
    } else {
      setErr(data?.message || "Failed to register user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
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

  // ✅ Task functions
  const onTaskSubmit = async (e) => {
    e.preventDefault();
    const res = await createTask(taskForm);
    if (res?._id) {
      setMsg("✅ Task assigned successfully");
      setTaskForm({ title: "", description: "", assignedTo: "", dueDate: "" });
      loadTasks();
    } else {
      setErr(res?.message || "Failed to create task");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    const res = await deleteTask(id);
    setMsg(res?.message || "Task deleted");
    loadTasks();
  };

  return (
    <div className="emp-wrap">
      <header className="emp-header">
        <h1>Employee Manager Dashboard</h1>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </header>

      {/* Register form */}
      <section className="card">
        <h2>Register User</h2>
        <p className="hint">
          You can register Rubber Tappers, Inventory Managers, or Supplier
          Managers.
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
          <div className="field">
            <label>Role</label>
            <select name="role" value={form.role} onChange={onChange}>
              <option value="employee">Rubber Tapper</option>
              <option value="inventoryManager">Inventory Manager</option>
              <option value="supplierManager">Supplier Manager</option>
            </select>
          </div>

          <div className="actions">
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </button>
          </div>
        </form>
      </section>

      {/* Users List */}
      <section className="card">
        <h2>All Registered Users</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id}>
                  <td>
                    {editingUser === u._id ? (
                      <input
                        value={editForm.firstName}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            firstName: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      u.firstName
                    )}{" "}
                    {editingUser === u._id ? (
                      <input
                        value={editForm.lastName}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            lastName: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      u.lastName
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
                  <td>{u.role}</td>
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
                <td colSpan="4">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* ✅ Task Assignment for Rubber Tappers */}
      <section className="card">
        <h2>Assign Task to Rubber Tappers</h2>
        <form className="grid" onSubmit={onTaskSubmit}>
          <input
            name="title"
            placeholder="Task Title"
            value={taskForm.title}
            onChange={(e) =>
              setTaskForm((f) => ({ ...f, title: e.target.value }))
            }
            required
          />
          <input
            name="description"
            placeholder="Description"
            value={taskForm.description}
            onChange={(e) =>
              setTaskForm((f) => ({ ...f, description: e.target.value }))
            }
          />
          <select
            name="assignedTo"
            value={taskForm.assignedTo}
            onChange={(e) =>
              setTaskForm((f) => ({ ...f, assignedTo: e.target.value }))
            }
            required
          >
            <option value="">-- Select Rubber Tapper --</option>
            {users
              .filter((u) => u.role === "employee")
              .map((u) => (
                <option key={u._id} value={u._id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
          </select>
          <input
            type="date"
            name="dueDate"
            value={taskForm.dueDate}
            onChange={(e) =>
              setTaskForm((f) => ({ ...f, dueDate: e.target.value }))
            }
          />
          <button type="submit">Assign Task</button>
        </form>

        <table className="users-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((t) => (
                <tr key={t._id}>
                  <td>{t.title}</td>
                  <td>
                    {t.assignedTo?.firstName} {t.assignedTo?.lastName}
                  </td>
                  <td>{t.status}</td>
                  <td>
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}
                  </td>
                  <td>
                    <button onClick={() => handleDeleteTask(t._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No tasks found</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default EmployeeManagerLanding;
