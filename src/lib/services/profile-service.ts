import { isAxiosError } from "axios";
import type { Profile, PublicProfile } from "../types/profile";
import type { ProblemDetail } from "../types/model/problem-detail";
import axiosInstance from "../utils/axios-instance";

export async function FetchOwnProfileData(): Promise<Profile> {
  try {
    const response = await axiosInstance.get<Profile>(
      "/profile-api/v1/profile",
      { withCredentials: false }
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw error.response.data as ProblemDetail;
      }
    }
    throw error;
  }
}

export async function FetchOtherProfileData(
  userId: number
): Promise<PublicProfile> {
  try {
    const response = await axiosInstance.get<PublicProfile>(
      `/profile-api/v1/profile/${userId}`,
      { withCredentials: false }
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw error.response.data as ProblemDetail;
      }
    }
    throw error;
  }
}
