import axios from "axios";
import type { AccessTokenHandlers } from "../types/access-token";
import type { CustomAxiosRequestConfig } from "../types/custom-axios-request";
let getAccessToken: AccessTokenHandlers["getAccessToken"] = () => null;
let setAccessToken: AccessTokenHandlers["setAccessToken"] = () => {};
export const registerAccessTokenHandlers = (
  getFn: AccessTokenHandlers["getAccessToken"],
  setFn: AccessTokenHandlers["setAccessToken"]
) => {
  getAccessToken = getFn;
  setAccessToken = setFn;
};

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  withCredentials: true,
});

// request interceptor
axiosInstance.interceptors.request.use((config: CustomAxiosRequestConfig) => {
  const shouldAttachToken =
    config.skipAuth !== false && !config.url?.includes("/auth-api/v1/auth/");
  if (shouldAttachToken) {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = axios
          .get("/auth-api/auth/renew-token", { withCredentials: true })
          .then((res) => {
            const newToken = res.data.accessToken;
            setAccessToken(newToken);
            return newToken;
          })
          .catch(() => {
            setAccessToken(null);
            return null;
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      const newToken = await refreshPromise;

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
