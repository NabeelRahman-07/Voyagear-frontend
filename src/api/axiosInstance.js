import axios from "axios";

const api = axios.create({
  baseURL: "https://e-com-backend-qhgo.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export default api;
