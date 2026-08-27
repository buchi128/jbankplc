import axios from "axios";

const API = axios.create({
  baseURL: "https://vercel.app"
});
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, err => Promise.reject(err));

export default API;