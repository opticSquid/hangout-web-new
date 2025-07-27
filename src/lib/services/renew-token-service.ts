import axios, { isAxiosError } from "axios";
import type { DeviceDetails } from "../types/device-details";
import type { ProblemDetail } from "../types/model/problem-detail";

export async function DeliberateRenewAccessToken(
  deviceSpecs: DeviceDetails
): Promise<string> {
  try {
    console.log("Requesting access token renewal");
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/auth-api/v1/auth/renew`,
      {
        headers: {
          OS: deviceSpecs.os.name,
          "Screen-Width": deviceSpecs.screen.width,
          "Screen-Height": deviceSpecs.screen.height,
        },
        withCredentials: true,
      }
    );
    console.log("Access token renew response:", response);
    return response.data.accessToken;
  } catch (error) {
    console.error("Error renewing access token:", error);
    if (isAxiosError(error) && error.response?.data) {
      throw error.response.data as ProblemDetail;
    }
    throw error;
  }
}
