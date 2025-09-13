import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLanding from "./pages/AdminLanding";
import EmployeeManagerLanding from "./pages/EmployeeManagerLanding";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminLanding />} />
        <Route path="/employee-manager" element={<EmployeeManagerLanding />} />
      </Routes>
    </Router>
  );
}

export default App;
