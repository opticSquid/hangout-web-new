import { isAxiosError } from "axios";
import type { DeviceDetails } from "../types/device-details";
import type { AuthResponse } from "../types/model/auth-response";
import axiosInstance from "../utils/axios-instance";
import type { ProblemDetail } from "../types/model/problem-detail";

export async function Trust(
  deviceDetails: DeviceDetails
): Promise<AuthResponse> {
  try {
    const response = await axiosInstance.get("/auth-api/v1/user/trust-device", {
      headers: {
        OS: deviceDetails.os.name,
        "Screen-Width": deviceDetails.screen.width,
        "Screen-Height": deviceDetails.screen.height,
      },
      withCredentials: true,
    });
    const data = response.data as AuthResponse;
    data.isTrustedDevice = true;
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw error.response.data as ProblemDetail;
      }
    }
    throw error;
  }
}
