const API = "http://localhost:8080/api";

export const getDashboardStats = () =>
  fetch(`${API}/dashboard`).then(r => r.json());

export const getAllTickets = () =>
  fetch(`${API}/tickets/latest`).then(r => r.json());

export const getUsers = () =>
  fetch(`${API}/users`).then(r => r.json());