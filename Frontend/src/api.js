import axios from "axios";

export const API_BASE = "http://127.0.0.1:8000/api";

// Create one reusable axios instance for all requests
export const api = axios.create({
  baseURL: API_BASE,
});


//  Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  // do not attach token to auth endpoints
  const publicRoutes = [
    "/faculty/login/",
    "/coe/send-otp/",
    "/coe/verify-otp/"
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    config.url.includes(route)
  );
  if (token && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// if session completes then redirect to the login page with alert session expire

const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("role");
  window.location.href = "/";
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        logout();
        return Promise.reject(error);
      }

      try {
        const res = await api.post(
          "/token/refresh/",
          { refresh }
        );

        const newAccess = res.data.access;

        localStorage.setItem("access", newAccess);

        api.defaults.headers.Authorization = `Bearer ${newAccess}`;
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return api(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);