import axios from "axios";

alert("AXIOS INSTANCE LOADED");

const api = axios.create({
  baseURL: "https://e-com-backend-qhgo.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
