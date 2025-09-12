import { useEffect, useState } from 'react';
import api from '../api';

const EmployeeManager = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    await api.delete(`/users/${id}`);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const editUser = async (u) => {
    const firstName = prompt('First name', u.firstName);
    const lastName = prompt('Last name', u.lastName);
    if (firstName == null || lastName == null) return;
    const res = await api.patch(`/users/${u._id}`, { firstName, lastName });
    setUsers((prev) => prev.map((usr) => (usr._id === u._id ? res.data : usr)));
  };

  return (
    <div>
      <h2>Employees</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.firstName} {u.lastName}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => editUser(u)}>Edit</button>
                <button onClick={() => deleteUser(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManager;
