import axios from "axios";

const API = axios.create({
  baseURL: "https://jbank-backend-lajm.onrender.com"
});

export default API;