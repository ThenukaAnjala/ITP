// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLanding from "./pages/AdminLanding";
import EmployeeManagerLanding from "./pages/EmployeeManagerLanding";
import InventoryManagerLanding from "./pages/InventoryManagerLanding";
import TicketManagerLanding from "./pages/TicketManagerLanding";
import RubberTapper from "./pages/RubberTapper";
import AssignTask from "./pages/AssignTask"; // dY`^ new page import
import HelpDesk from "./pages/HelpDesk"; // dY`^ new page import
import TicketDetails from "./pages/TicketDetails"; // ?o. new page import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLanding />} />
        <Route path="/employee-manager" element={<EmployeeManagerLanding />} />
        <Route path="/inventory-manager" element={<InventoryManagerLanding />} />
        <Route path="/ticket-manager" element={<TicketManagerLanding />} />
        <Route path="/rubber-tapper" element={<RubberTapper />} />
        <Route path="/assign-task/:id" element={<AssignTask />} /> {/* dY`^ new route */}
        {/* <Route path="/rubber-tapper" element={<RubberTapper />} /> */}
        <Route path="/helpdesk" element={<HelpDesk />} /> {/* dY`^ new route */}
        <Route path="/tickets/:id" element={<TicketDetails />} /> {/* ?o. new */}
      </Routes>
    </Router>
  );
}

export default App;
