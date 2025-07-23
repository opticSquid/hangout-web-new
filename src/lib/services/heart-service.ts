import { isAxiosError } from "axios";
import type { DefaultResponse } from "../types/model/default-response";
import axiosInstance from "../utils/axios-instance";
import type { ProblemDetail } from "../types/model/problem-detail";
import type { HeartSchema } from "../types/post";

export async function UpdateHeartCount(
  addHeart: boolean,
  heartDetails: HeartSchema
): Promise<DefaultResponse> {
  try {
    let response;
    if (addHeart) {
      response = await axiosInstance.put(
        "/post-api/v1/heart/add",
        heartDetails,
        {
          withCredentials: true,
        }
      );
    } else {
      response = await axiosInstance.put(
        "/post-api/v1/heart/remove",
        heartDetails,
        {
          withCredentials: true,
        }
      );
    }
    return response.data as DefaultResponse;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data) {
      throw error.response.data as ProblemDetail;
    }
    throw error;
  }
}
