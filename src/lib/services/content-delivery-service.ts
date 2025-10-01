import { AxiosHeaders, isAxiosError } from "axios";
import type { SingedCookie } from "../types/props/signed-ccokie";
import type { CustomAxiosRequestConfig } from "../types/custom-axios-request";
import axiosInstance from "../utils/axios-instance";
import type { ProblemDetail } from "../types/model/problem-detail";

export async function FetchSignedCookies(
  videoFileName: string
): Promise<SingedCookie> {
  try {
    const rqConfig: CustomAxiosRequestConfig = {
      skipAuth: true,
      headers: new AxiosHeaders({ accept: "application/json" }),
      withCredentials: true,
    };
    const response = await axiosInstance.get(
      `/hangout-content-delivery-api/v1/get-content/${videoFileName}`,
      rqConfig
    );
    return response.data as SingedCookie;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw {
          type: "error",
          title: "Could not find video file",
          detail: "content delivery api returned error",
        } as ProblemDetail;
      }
    }
    throw error;
  }
}
