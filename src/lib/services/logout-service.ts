import { isAxiosError } from "axios";
import type { ProblemDetail } from "../types/model/problem-detail";
import axiosInstance from "../utils/axios-instance";
import type { DeviceDetails } from "../types/device-details";

export async function LogOut(deviceDetails: DeviceDetails): Promise<void> {
  try {
    await axiosInstance.delete("/auth-api/v1/user/logout", {
      headers: {
        OS: deviceDetails.os.name,
        "Screen-Width": deviceDetails.screen.width,
        "Screen-Height": deviceDetails.screen.height,
      },
      withCredentials: true,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw error.response.data as ProblemDetail;
      }
    }
    throw error;
  }
}
