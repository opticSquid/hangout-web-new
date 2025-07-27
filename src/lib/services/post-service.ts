import { AxiosHeaders, isAxiosError } from "axios";
import type { CustomAxiosRequestConfig } from "../types/custom-axios-request";
import type { ProblemDetail } from "../types/model/problem-detail";
import type {
  FetchPostsQueryParams,
  NewPostRs,
  Post,
  PostList,
} from "../types/post";
import axiosInstance from "../utils/axios-instance";

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

export async function FetchPostById(postId: string): Promise<Post> {
  try {
    const rqConfig: CustomAxiosRequestConfig = {
      skipAuth: true,
      headers: new AxiosHeaders({ accept: "application/json" }),
      withCredentials: false,
    };
    const response = await axiosInstance.get(
      `/post-api/v1/post/${postId}`,
      rqConfig
    );
    return response.data as Post;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw error.response.data as ProblemDetail;
      }
    }
    throw error;
  }
}

export async function AddPost(formData: FormData): Promise<NewPostRs> {
  try {
    const response = await axiosInstance.post(
      "/post-api/v1/post/short",
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data as NewPostRs;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw error.response.data as ProblemDetail;
      }
    }
    throw error;
  }
}

export async function FetchOwnPostsData(): Promise<Post[]> {
  try {
    const rqConfig: CustomAxiosRequestConfig = {
      skipAuth: true,
      headers: new AxiosHeaders({ accept: "application/json" }),
      withCredentials: false,
    };
    const response = await axiosInstance.get(
      "/post-api/v1/post/my-posts",
      rqConfig
    );
    return response.data as Post[];
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw error.response.data as ProblemDetail;
      }
    }
    throw error;
  }
}
