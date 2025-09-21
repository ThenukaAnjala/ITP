// src/pages/RubberTapper.jsx
import React, { useEffect, useState } from "react";
import { getMyTasks, updateTask } from "../services/inventoryApi";

function RubberTapper() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [tasks, setTasks] = useState([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // Timer states
  const [timers, setTimers] = useState({}); // { taskId: seconds }
  const [running, setRunning] = useState({}); // { taskId: boolean }

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

  // Timer interval effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = { ...prev };
        Object.keys(running).forEach((taskId) => {
          if (running[taskId]) {
            updated[taskId] = (updated[taskId] || 0) + 1;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  // Start timer
  const handleStart = async (taskId) => {
    setRunning((r) => ({ ...r, [taskId]: true }));
    setMsg(`▶️ Timer started for task ${taskId}`);

    try {
      await updateTask(taskId, { action: "START" }); // ✅ send action
      loadTasks();
    } catch {
      setErr("❌ Failed to update task");
    }
  };

  // Pause timer
  const handlePause = async (taskId) => {
    setRunning((r) => ({ ...r, [taskId]: false }));
    setMsg(`⏸️ Timer paused for task ${taskId}`);

    try {
      await updateTask(taskId, { action: "PAUSE" }); // ✅ send action
      loadTasks();
    } catch {
      setErr("❌ Failed to update task");
    }
  };

  // Stop timer and update status
  const handleStop = async (taskId) => {
    setRunning((r) => ({ ...r, [taskId]: false }));

    const newStatus = window.prompt(
      "Enter final status (IN_PROGRESS or DONE):",
      "DONE"
    );

    if (!newStatus) return;

    try {
      await updateTask(taskId, { status: newStatus, action: "STOP" }); // ✅ send status + action
      setMsg(`✅ Task updated to ${newStatus}`);
      setErr("");
      loadTasks();
    } catch {
      setErr("❌ Failed to update task");
    }
  };

  // Format time
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
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
            <th>Timer</th>
            <th>Actions</th>
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
                <td>{formatTime(timers[t._id] || 0)}</td>
                <td>
                  {!running[t._id] && (
                    <button onClick={() => handleStart(t._id)}>Start</button>
                  )}
                  {running[t._id] && (
                    <button onClick={() => handlePause(t._id)}>Pause</button>
                  )}
                  <button onClick={() => handleStop(t._id)}>Stop</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No tasks assigned yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RubberTapper;
