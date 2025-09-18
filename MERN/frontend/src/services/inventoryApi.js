const API = "http://localhost:5000/api";
const token = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

// ---------------- Items ----------------
export const getItems = async () => {
  const res = await fetch(`${API}/items`, { headers: headers() });
  return res.json();
};

export const createItem = async (payload) => {
  const res = await fetch(`${API}/items`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateItem = async (id, payload) => {
  const res = await fetch(`${API}/items/${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const deleteItem = async (id) => {
  const res = await fetch(`${API}/items/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  return res.json();
};

// ---------------- GRNs ----------------
export const getGrns = async () => {
  const res = await fetch(`${API}/grns`, { headers: headers() });
  return res.json();
};

export const createGrn = async (payload) => {
  const res = await fetch(`${API}/grns`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateGrn = async (id, payload) => {
  const res = await fetch(`${API}/grns/${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const deleteGrn = async (id) => {
  const res = await fetch(`${API}/grns/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  return res.json();
};
