const API = "http://localhost:5000/api/helpdesk";

const headers = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const submitHelpTicket = async (payload) => {
  const res = await fetch(API, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to submit help ticket");
  }

  return res.json();
};

export const fetchAllHelpTickets = async () => {
  const res = await fetch(API, {
    headers: headers(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch help tickets");
  }

  return res.json();
};

export const fetchMyHelpTickets = async () => {
  const res = await fetch(`${API}/my`, {
    headers: headers(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch help tickets");
  }

  return res.json();
};

export const updateHelpTicket = async (id, payload) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update help ticket");
  }

  return res.json();
};

export const deleteHelpTicket = async (id) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: headers(),
  });

  if (!res.ok) {
    throw new Error("Failed to delete help ticket");
  }

  return res.json();
};

export default {
  submitHelpTicket,
  fetchAllHelpTickets,
  fetchMyHelpTickets,
  updateHelpTicket,
  deleteHelpTicket,
};
