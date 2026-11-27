import axios from "axios";

// Set VITE_API_BASE_URL in .env (see .env.example) to point at a different backend.
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8080/api",
});

// Attach the JWT to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// An expired or invalid token ends the session. Login failures are left alone.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthCall = url.startsWith("/auth/");

    if (error.response?.status === 401 && !isAuthCall) {
      const onAdminPages = window.location.pathname.startsWith("/admin");

      localStorage.clear();

      window.location.assign(
        onAdminPages ? "/admin/login" : "/login"
      );
    }

    return Promise.reject(error);
  }
);

export default api;
