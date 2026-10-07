import axios from "axios";

export const api =
  axios.create({
    baseURL:
      import.meta.env
        .VITE_API_URL ||
      "http://localhost:5000",

    withCredentials: true,
  });

api.interceptors.request.use(
  (config) => {
    const csrfToken =
      localStorage.getItem(
        "haven_csrf",
      );

    const method =
      config.method
        ?.toUpperCase();

    const needsCsrf =
      method &&
      ![
        "GET",
        "HEAD",
        "OPTIONS",
      ].includes(method);

    if (
      csrfToken &&
      needsCsrf
    ) {
      config.headers[
        "X-CSRF-Token"
      ] = csrfToken;
    }

    return config;
  },

  (error) =>
    Promise.reject(error),
);

api.interceptors.response.use(
  (response) =>
    response,

  (error) => {
    if (
      error.response?.status ===
      401
    ) {
      localStorage.removeItem(
        "haven_user",
      );

      localStorage.removeItem(
        "haven_csrf",
      );

      localStorage.removeItem(
        "haven_token",
      );
    }

    return Promise.reject(
      error,
    );
  },
);