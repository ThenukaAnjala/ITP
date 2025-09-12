import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminRegister from './pages/AdminRegister';
import AdminLanding from './pages/AdminLanding';
import EmployeeManager from './pages/EmployeeManager';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const RequireAuth = ({ children, roles }) => {
    if (!token || !user) return <Navigate to="/" replace />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RequireAuth roles={['ADMIN']}>
              <AdminLanding />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/register"
          element={
            <RequireAuth roles={['ADMIN']}>
              <AdminRegister />
            </RequireAuth>
          }
        />
        <Route
          path="/employee-manager"
          element={
            <RequireAuth roles={['EMPLOYEE_MANAGER', 'ADMIN']}>
              <EmployeeManager />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
