import React from "react";
import "../styles/pages/admin.css"; // optional CSS file if you want styles

function AdminLanding() {
  const handleLogout = () => {
    localStorage.removeItem("token"); // 🔑 remove token
    window.location.href = "/"; // redirect to login page
  };

  return (
    <div className="admin-container">
      <h1>Welcome Admin 🎉</h1>
      <p>You are logged in as <b>Admin</b>.</p>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default AdminLanding;
