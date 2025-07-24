import { isAxiosError } from "axios";
import type { Address } from "../types/address";
import type { ProblemDetail } from "../types/model/problem-detail";
import axiosInstance from "../utils/axios-instance";

export async function FindAddress(
  location: GeolocationPosition
): Promise<Address> {
  try {
    const response = await axiosInstance.get(
      "/post-api/v1/address/get-details",
      {
        params: {
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        },
        withCredentials: true,
      }
    );
    return response.data as Address;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw error.response.data as ProblemDetail;
      }
    }
    throw error;
  }
}
