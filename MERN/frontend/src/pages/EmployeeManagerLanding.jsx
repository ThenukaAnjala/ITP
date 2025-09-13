import React from "react";
import "../styles/pages/manager.css"; // optional styles (below)

function EmployeeManagerLanding() {
  const handleLogout = () => {
    localStorage.removeItem("token"); // 🔑 remove JWT
    window.location.href = "/";        // 🔁 go back to login
  };

  return (
    <div className="manager-wrap">
      <header className="manager-header">
        <h1>Employee Manager Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <section className="card">
        <h2>Welcome 👋</h2>
        <p className="hint">
          You can view, edit, and delete employees from here. (We’ll add the table next.)
        </p>
      </section>
    </div>
  );
}

export default EmployeeManagerLanding;
