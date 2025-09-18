// src/pages/RubberTapper.jsx
import React from "react";

function RubberTapper() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>👷 Rubber Tapper Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <p>Welcome {user?.firstName ? `${user.firstName} ${user.lastName}` : ""}!</p>
      <p>Here you can see your tapping schedules, assigned blocks, and daily submissions.</p>
      {/* TODO: Add your features here */}
    </div>
  );
}

export default RubberTapper;
