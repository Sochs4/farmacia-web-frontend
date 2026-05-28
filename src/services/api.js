import axios from "axios";

const api = axios.create({
  baseURL: "https://fart24.runasp.net/api",
});

export default api;