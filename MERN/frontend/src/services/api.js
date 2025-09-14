// 🔐 Login user (Admin, Manager, etc.)
export const loginUser = async (email, password) => {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// 🔐 Register Employee Manager (Admin only)
export const registerEmployeeManager = async (payload) => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/auth/admin/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // admin token required
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

// 🔹 Get all users (Admin / Employee Manager only)
export const getUsers = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};
