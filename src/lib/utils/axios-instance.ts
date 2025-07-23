import axios from "axios";
import type { AccessTokenHandlers } from "../types/access-token";
import type { CustomAxiosRequestConfig } from "../types/custom-axios-request";
import { osMap, type DeviceDetails } from "../types/device-details";
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

const deviceSpecs: DeviceDetails = {
  os: { name: "", version: "" },
  screen: { height: 0, width: 0 },
};
if (typeof screen.width === "number") {
  deviceSpecs.screen.width = screen.width;
}
if (typeof screen.height === "number") {
  deviceSpecs.screen.height = screen.height;
}
let found: boolean = false;
for (const [key, value] of Object.entries(osMap)) {
  if (window.navigator.userAgent.toLowerCase().includes(key)) {
    deviceSpecs.os = value;
    found = true;
    break;
  }
}
if (!found) {
  deviceSpecs.os = { name: "unknown" };
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  withCredentials: true,
});

// request interceptor
axiosInstance.interceptors.request.use((config: CustomAxiosRequestConfig) => {
  const shouldAttachToken =
    !config.skipAuth && !config.url?.startsWith("/auth-api/v1/auth/");
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
    console.log("request error: ", error);
    if (
      (error.response?.status === 401 ||
        error.response?.data.detail ===
          "Required header 'Authorization' is not present.") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = axiosInstance
          .get("/auth-api/v1/auth/renew", {
            headers: {
              OS: deviceSpecs.os.name,
              "Screen-Width": deviceSpecs.screen.width,
              "Screen-Height": deviceSpecs.screen.height,
            },
            withCredentials: true,
          })
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
