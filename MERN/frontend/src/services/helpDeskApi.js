const API = "http://localhost:5000/api/helpdesk";

const headers = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Request failed");
  }
  return res.json();
};

export const submitHelpTicket = async (payload) => {
  const res = await fetch(API, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
};

export const fetchAllHelpTickets = async () => {
  const res = await fetch(API, {
    headers: headers(),
  });

  return handleResponse(res);
};

export const fetchMyHelpTickets = async () => {
  const res = await fetch(`${API}/my`, {
    headers: headers(),
  });

  return handleResponse(res);
};

export const fetchHelpTicket = async (id) => {
  const res = await fetch(`${API}/${id}`, {
    headers: headers(),
  });

  return handleResponse(res);
};

export const updateHelpTicket = async (id, payload) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
};

export const deleteHelpTicket = async (id) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: headers(),
  });

  return handleResponse(res);
};

export const sendHelpTicketMessage = async (id, payload) => {
  const res = await fetch(`${API}/${id}/message`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
};

export const updateHelpTicketMessage = async (id, messageId, payload) => {
  const res = await fetch(`${API}/${id}/message/${messageId}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
};

export const deleteHelpTicketMessage = async (id, messageId) => {
  const res = await fetch(`${API}/${id}/message/${messageId}`, {
    method: "DELETE",
    headers: headers(),
  });

  return handleResponse(res);
};

export default {
  submitHelpTicket,
  fetchAllHelpTickets,
  fetchMyHelpTickets,
  fetchHelpTicket,
  updateHelpTicket,
  deleteHelpTicket,
  sendHelpTicketMessage,
  updateHelpTicketMessage,
  deleteHelpTicketMessage,
};
