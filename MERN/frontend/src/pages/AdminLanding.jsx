import { Link } from 'react-router-dom';

const AdminLanding = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome {user?.firstName}</p>
      <nav>
        <Link to="/admin/register">Register Employee Manager</Link>
        <br />
        <Link to="/employee-manager">Manage Employees</Link>
      </nav>
    </div>
  );
};

export default AdminLanding;
