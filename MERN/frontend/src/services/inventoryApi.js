const API = "http://localhost:5000/api";

// 🔑 Get token from localStorage safely
const token = () => localStorage.getItem("token");

// 🛠️ Common headers with token (if exists)
const headers = () => {
  const t = token();
  return t
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      }
    : { "Content-Type": "application/json" };
};

// 🛠️ Helper: check fetch response
const handleResponse = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
};

// ---------------- Items ----------------
export const getItems = async () => {
  const res = await fetch(`${API}/items`, { headers: headers() });
  return handleResponse(res);
};

export const createItem = async (payload) => {
  const res = await fetch(`${API}/items`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const updateItem = async (id, payload) => {
  const res = await fetch(`${API}/items/${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const deleteItem = async (id) => {
  const res = await fetch(`${API}/items/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  return handleResponse(res);
};

// ---------------- GRNs ----------------
export const getGrns = async () => {
  const res = await fetch(`${API}/grns`, { headers: headers() });
  return handleResponse(res);
};

export const createGrn = async (payload) => {
  const res = await fetch(`${API}/grns`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const updateGrn = async (id, payload) => {
  const res = await fetch(`${API}/grns/${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const deleteGrn = async (id) => {
  const res = await fetch(`${API}/grns/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  return handleResponse(res);
};

// ---------------- Tasks ----------------
export const getTasks = async () => {
  const res = await fetch(`${API}/tasks`, { headers: headers() });
  return handleResponse(res);
};

// ✅ Get logged-in Rubber Tapper’s tasks
export const getMyTasks = async () => {
  const res = await fetch(`${API}/tasks/my`, { headers: headers() });
  return handleResponse(res);
};

export const createTask = async (payload) => {
  const res = await fetch(`${API}/tasks`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const updateTask = async (id, payload) => {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const deleteTask = async (id) => {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  return handleResponse(res);
};
