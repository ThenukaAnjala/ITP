const API = "http://localhost:5000/api/tickets";

const headers = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const getMyTickets = async () => {
  const res = await fetch(`${API}/my`, { headers: headers() });
  return res.json();
};

export const createTicket = async (payload) => {
  const res = await fetch(API, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateTicket = async (id, payload) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const deleteTicket = async (id) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  return res.json();
};

export default {
  getMyTickets,
  createTicket,
  updateTicket,
  deleteTicket,
};
