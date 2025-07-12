import { isAxiosError } from "axios";
import type { DeviceDetails } from "../types/device-details";
import type { LoginFormSchema } from "../types/login";
import type { SigninResponse } from "../types/model/signin-response";
import type { ProblemDetail } from "../types/model/problem-detail";
import axiosInstance from "../utils/axios-instance";

export async function Signin(
  creds: LoginFormSchema,
  deviceDetails: DeviceDetails
): Promise<SigninResponse> {
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
    return response.data as SigninResponse;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw error.response.data as ProblemDetail;
      }
    }
    throw error;
  }
}
