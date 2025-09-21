// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLanding from "./pages/AdminLanding";
import EmployeeManagerLanding from "./pages/EmployeeManagerLanding";
import InventoryManagerLanding from "./pages/InventoryManagerLanding";
import SupplierManagerLanding from "./pages/SupplierManagerLanding";
import RubberTapper from "./pages/RubberTapper";
import AssignTask from "./pages/AssignTask"; // 👈 new page import
import HelpDesk from "./pages/HelpDesk"; // 👈 new page import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminLanding />} />
        <Route path="/employee-manager" element={<EmployeeManagerLanding />} />
        <Route path="/inventory-manager" element={<InventoryManagerLanding />} />
        <Route path="/supplier-manager" element={<SupplierManagerLanding />} />
        <Route path="/rubber-tapper" element={<RubberTapper />} />
        <Route path="/assign-task/:id" element={<AssignTask />} /> {/* 👈 new route */}
        {/* <Route path="/rubber-tapper" element={<RubberTapper />} /> */}
        <Route path="/helpdesk" element={<HelpDesk />} /> {/* 👈 new route */}
      </Routes>
    </Router>
  );
}

export default App;
