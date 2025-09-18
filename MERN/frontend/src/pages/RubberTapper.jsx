// src/pages/RubberTapper.jsx
import React, { useEffect, useState } from "react";
import { getMyTasks, updateTask } from "../services/inventoryApi";

function RubberTapper() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [tasks, setTasks] = useState([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const loadTasks = async () => {
    try {
      const data = await getMyTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      setErr("❌ Could not fetch tasks.");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Update status
  const handleStatusChange = async (id, status) => {
    try {
      const res = await updateTask(id, { status });
      if (res?._id) {
        setMsg(`✅ Task updated to ${status}`);
        setErr("");
        loadTasks();
      }
    } catch {
      setErr("❌ Failed to update task");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2>👷 Rubber Tapper Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <p>
        Welcome {user?.firstName ? `${user.firstName} ${user.lastName}` : ""}!
      </p>

      <h3>📋 My Assigned Tasks</h3>
      {msg && <div style={{ color: "green", marginBottom: 8 }}>{msg}</div>}
      {err && <div style={{ color: "red", marginBottom: 8 }}>{err}</div>}

      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: 16 }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((t) => (
              <tr key={t._id}>
                <td>{t.title}</td>
                <td>{t.description || "-"}</td>
                <td>
                  {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}
                </td>
                <td>{t.status}</td>
                <td>
                  {t.status === "PENDING" && (
                    <button onClick={() => handleStatusChange(t._id, "IN_PROGRESS")}>
                      Start
                    </button>
                  )}
                  {t.status === "IN_PROGRESS" && (
                    <button onClick={() => handleStatusChange(t._id, "DONE")}>
                      Mark Done
                    </button>
                  )}
                  {t.status === "DONE" && <span>✅ Completed</span>}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No tasks assigned yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RubberTapper;
