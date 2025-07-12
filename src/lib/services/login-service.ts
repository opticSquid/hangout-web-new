import { isAxiosError } from "axios";
import type { DeviceDetails } from "../types/device-details";
import type { LoginFormSchema } from "../types/login";
import type { LoginResponse } from "../types/model/login-response";
import type { ProblemDetail } from "../types/model/problem-detail";
import axiosInstance from "../utils/axios-instance";

export async function Login(
  creds: LoginFormSchema,
  deviceDetails: DeviceDetails
): Promise<LoginResponse> {
  try {
    const response = await axiosInstance.post(
      "/auth-api/v1/auth/login",
      creds,
      {
        headers: {
          OS: deviceDetails.os.name,
          "Screen-Width": deviceDetails.screen.width,
          "Screen-Height": deviceDetails.screen.height,
        },
        withCredentials: true,
      }
    );
    return response.data as LoginResponse;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw error.response.data as ProblemDetail;
      }
    }
    throw error;
  }
}
