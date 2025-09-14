// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLanding from "./pages/AdminLanding";
import EmployeeManagerLanding from "./pages/EmployeeManagerLanding";
import InventoryManagerLanding from "./pages/InventoryManagerLanding";
import SupplierManagerLanding from "./pages/SupplierManagerLanding";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminLanding />} />
        <Route path="/employee-manager" element={<EmployeeManagerLanding />} />
        <Route path="/inventory-manager" element={<InventoryManagerLanding />} />
        <Route path="/supplier-manager" element={<SupplierManagerLanding />} />
      </Routes>
    </Router>
  );
}

export default App;
