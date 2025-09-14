// src/services/api.js

// 🔐 Login user
export const loginUser = async (email, password) => {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
};

// 🔐 Register Employee Manager (Admin only)
export const registerEmployeeManager = async (payload) => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/auth/admin/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

// 🔹 Generic Register User
export const registerUser = async (payload) => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

// 🔹 Get all users
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

// 🔹 Delete user
export const deleteUser = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5000/api/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

// 🔹 Update user
export const updateUser = async (id, payload) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5000/api/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};
