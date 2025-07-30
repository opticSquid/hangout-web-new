import axios, { isAxiosError } from "axios";
import { osMap, type DeviceDetails } from "../types/device-details";
import type { ProblemDetail } from "../types/model/problem-detail";

function initDeviceSpecs(): DeviceDetails {
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
  return deviceSpecs;
}

export async function RenewAccessToken(): Promise<string> {
  const deviceSpecs = initDeviceSpecs();
  try {
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
    return response.data.accessToken;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data) {
      throw error.response.data as ProblemDetail;
    }
    throw error;
  }
}
