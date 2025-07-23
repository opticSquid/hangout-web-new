import { AxiosHeaders, isAxiosError } from "axios";
import type { CustomAxiosRequestConfig } from "../types/custom-axios-request";
import type { FetchPostsQueryParams, PostList } from "../types/post";
import axiosInstance from "../utils/axios-instance";
import type { ProblemDetail } from "../types/model/problem-detail";

export async function FetchPosts(
  queryParams: FetchPostsQueryParams
): Promise<PostList> {
  try {
    const rqConfig: CustomAxiosRequestConfig = {
      skipAuth: true,
      params: queryParams,
      headers: new AxiosHeaders({ accept: "application/json" }),
      withCredentials: false,
    };
    const response = await axiosInstance.get(
      "/post-api/v1/post/near-me",
      rqConfig
    );
    return response.data as PostList;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw error.response.data as ProblemDetail;
      }
    }
    throw error;
  }
}
