import axios from "axios";

const api = axios.create({
  baseURL: "https://ticketing.development.atelier.ovh/api/mobile",
});

// 🔑 TEMP : token en dur (juste pour tester)
api.interceptors.request.use((config) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiam1haXZrZjFuaHgyeW41IiwiZXhwIjoxNzU2OTAyMTcwLCJpYXQiOjE3NTY4MTU3NzB9.TWYqP6VvJTQUarTV0-kESz51XlpF-mTnnSGZ5QBoFyA"; 
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
