import { isAxiosError } from "axios";
import type { DefaultResponse } from "../types/model/default-response";
import type { ProblemDetail } from "../types/model/problem-detail";
import type { Profile, PublicProfile } from "../types/profile";
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

export async function DoesProfileExist(): Promise<boolean> {
  try {
    const response = await axiosInstance.get<Profile>(
      "/profile-api/v1/profile",
      { withCredentials: false }
    );
    return response.status === 200;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 404) {
        return false;
      } else {
        throw error.response?.data as ProblemDetail;
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

export async function CreateProfile(
  formData: FormData
): Promise<DefaultResponse> {
  try {
    const response = await axiosInstance.post<DefaultResponse>(
      "/profile-api/v1/profile",
      formData,
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
