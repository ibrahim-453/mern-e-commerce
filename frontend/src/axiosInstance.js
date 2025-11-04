// src/axiosInstance.js
import axios from "axios";
import { store } from "./redux/store";
import { setUser, logout } from "./redux/features/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res  = await api.post("/api/v1/auth/refreshToken",{withCredentials:true});
        const newUser = res.data.data?.user;
        if (newUser) {
          store.dispatch(setUser({ user: newUser }));
        }
        return api(originalRequest);
      } catch (refreshErr) {
        store.dispatch(logout());
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
