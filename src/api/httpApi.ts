import axios from "axios";
import { triggerUnauthorizedLogout } from "./authEvents";

const baseURL = import.meta.env.VITE_API_BASE_URL as string;

const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      triggerUnauthorizedLogout();
    }

    return Promise.reject(error);
  }
);

export default api;
