import type { InternalAxiosRequestConfig } from "axios";

export interface CustomAxiosRequestConfig<D = any>
  extends InternalAxiosRequestConfig<D> {
  skipAuth?: boolean;
}
