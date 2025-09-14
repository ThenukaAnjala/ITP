// src/pages/InventoryManagerLanding.jsx
import React, { useState, useEffect } from "react";
import { getUsers } from "../services/api";
import "../styles/pages/inventoryManager.css";

function InventoryManagerLanding() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      if (Array.isArray(data)) {
        // Show employees under inventory manager
        const filtered = data.filter((u) => u.role === "employee");
        setUsers(filtered);
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

  return (
    <div className="inv-wrap">
      <header className="inv-header">
        <h1>Inventory Manager Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="card">
        <h2>All Employees</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id}>
                  <td>
                    {u.firstName} {u.lastName}
                  </td>
                  <td>{u.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No employees found</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default InventoryManagerLanding;
