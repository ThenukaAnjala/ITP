import React, { useEffect, useState } from "react";
import "../styles/pages/manager.css";

function EmployeeManagerLanding() {
  const [managerName, setManagerName] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setManagerName(`${user.firstName} ${user.lastName}`);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="manager-wrap">
      <header className="manager-header">
        <div className="manager-info">
          <span className="manager-name">👤 {managerName}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="card">
        <h2>Welcome, {managerName} 👋</h2>
        <p>You can manage employees here (view, edit, delete will be added next).</p>
      </section>
    </div>
  );
}

export default EmployeeManagerLanding;
