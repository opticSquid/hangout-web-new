import type { AxiosRequestConfig, AxiosRequestHeaders } from "axios";

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  headers: AxiosRequestHeaders;
}
