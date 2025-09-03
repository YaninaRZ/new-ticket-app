import axios from "axios";

const api = axios.create({
  baseURL: "https://ticketing.development.atelier.ovh/api/mobile",
});

// 🔑 TEMP : token en dur (juste pour tester)
api.interceptors.request.use((config) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiam1haXZrZjFuaHgyeW41IiwiZXhwIjoxNzU2OTk3NzM1LCJpYXQiOjE3NTY5MTEzMzV9.NpwEgdMnXsojSV7X7FXxKmXEHrtVz3OVJf7rA3w0PrI"; 
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
