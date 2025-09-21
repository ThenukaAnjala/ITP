// src/pages/AssignTask.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/inventoryApi";
import { getUsers } from "../services/api";

function AssignTask() {
  const { id } = useParams(); // 👈 Rubber Tapper ID

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: id || "",
    dueDate: "",
    status: "PENDING",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // 🔄 Load users + tasks
  useEffect(() => {
    loadUsers();
    loadTasks();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.filter((u) => u.role === "employee")); // only Rubber Tappers
    } catch {
      setErr("❌ Failed to load users");
    }
  };

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      const filtered = Array.isArray(data)
        ? data.filter((t) => t.assignedTo?._id === id)
        : [];
      setTasks(filtered);
    } catch {
      setErr("❌ Failed to load tasks");
    }
  };

  // ➕ Add / Save Task
  const onSubmit = async (e) => {
    e.preventDefault();
    let res;
    try {
      if (editingTask) {
        res = await updateTask(editingTask, taskForm);
        if (res?._id) setMsg("✅ Task updated successfully");
      } else {
        res = await createTask(taskForm);
        if (res?._id) setMsg("✅ Task created successfully");
      }

      // Reset form
      setTaskForm({
        title: "",
        description: "",
        assignedTo: id || "",
        dueDate: "",
        status: "PENDING",
      });
      setEditingTask(null);
      loadTasks();
    } catch {
      setErr("❌ Failed to save task");
    }
  };

  // ✏️ Edit task
  const handleEdit = (task) => {
    setEditingTask(task._id);
    setTaskForm({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo?._id || id,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      status: task.status,
    });
  };

  // ❌ Delete task
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await deleteTask(taskId);
      setMsg(res?.message || "Task deleted");
      loadTasks();
    } catch {
      setErr("❌ Failed to delete task");
    }
  };

  return (
    <div className="emp-wrap">
      <header className="emp-header">
        <h1>Tasks for Rubber Tapper</h1>
        <BackButton includeBaseStyles={false} className="logout-btn">Back</BackButton>
      </header>

      {msg && <div className="ok">{msg}</div>}
      {err && <div className="error">{err}</div>}

      {/* Task Form */}
      <section className="card">
        <form className="grid" onSubmit={onSubmit}>
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
            {users.map((u) => (
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
          <select
            name="status"
            value={taskForm.status}
            onChange={(e) =>
              setTaskForm((f) => ({ ...f, status: e.target.value }))
            }
          >
            <option value="PENDING">PENDING</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
          <button type="submit">
            {editingTask ? "Update Task" : "Assign Task"}
          </button>
        </form>
      </section>

      {/* Task List */}
      <section className="card">
        <h2>Assigned Tasks</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>History</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((t) => (
                <tr key={t._id}>
                  <td>{t.title}</td>
                  <td>{t.status}</td>
                  <td>
                    {t.dueDate
                      ? new Date(t.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {t.history?.length > 0 ? (
                      <details>
                        <summary>View</summary>
                        <ul>
                          {t.history.map((h, i) => (
                            <li key={i}>
                              <b>{h.action}</b> at{" "}
                              {h.at
                                ? new Date(h.at).toLocaleString()
                                : "No Date"}
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      "No history"
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(t)}>Edit</button>
                    <button onClick={() => handleDelete(t._id)}>Delete</button>
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

export default AssignTask;
