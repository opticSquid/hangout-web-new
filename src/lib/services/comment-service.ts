import { AxiosHeaders, isAxiosError } from "axios";
import type { Comment, NewCommentRq, NewCommentRs } from "../types/comment";
import type { CustomAxiosRequestConfig } from "../types/custom-axios-request";
import type { ProblemDetail } from "../types/model/problem-detail";
import axiosInstance from "../utils/axios-instance";

export async function FetchAllTopLevelComments(
  postId: string
): Promise<Comment[]> {
  try {
    const rqConfig: CustomAxiosRequestConfig = {
      skipAuth: true,
      headers: new AxiosHeaders({ accept: "application/json" }),
      withCredentials: false,
    };
    const response = await axiosInstance.get(
      `/post-api/v1/comment/all/${postId}`,
      rqConfig
    );
    return response.data as Comment[];
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw error.response.data as ProblemDetail;
      }
    }
    throw error;
  }
}

export async function AddComment(
  commentRq: NewCommentRq
): Promise<NewCommentRs> {
  try {
    const response = await axiosInstance.post(
      "/post-api/v1/comment",
      commentRq,
      { withCredentials: true }
    );
    return response.data as NewCommentRs;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw error.response.data as ProblemDetail;
      }
    }
    throw error;
  }
}

export async function FetchCommentById(commentId: string): Promise<Comment> {
  try {
    const rqConfig: CustomAxiosRequestConfig = {
      skipAuth: true,
      headers: new AxiosHeaders({ accept: "application/json" }),
      withCredentials: false,
    };
    const response = await axiosInstance.get(
      `/post-api/v1/comment/${commentId}`,
      rqConfig
    );
    return response.data as Comment;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw error.response.data as ProblemDetail;
      }
    }
    throw error;
  }
}

export async function FetchAllReplies(commentId: string): Promise<Comment[]> {
  try {
    const rqConfig: CustomAxiosRequestConfig = {
      skipAuth: true,
      headers: new AxiosHeaders({ accept: "application/json" }),
      withCredentials: false,
    };
    const response = await axiosInstance.get(
      `/post-api/v1/comment/${commentId}/replies`,
      rqConfig
    );
    return response.data as Comment[];
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw error.response.data as ProblemDetail;
      }
    }
    throw error;
  }
}
