import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<h1>Admin Landing Page</h1>} />
        <Route
          path="/employee-manager"
          element={<h1>Employee Manager Landing Page</h1>}
        />
      </Routes>
    </Router>
  );
}

export default App;
