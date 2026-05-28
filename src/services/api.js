import axios from "axios";

const api = axios.create({
 baseURL: "http://fart24.runasp.net/api"
});

export default api;