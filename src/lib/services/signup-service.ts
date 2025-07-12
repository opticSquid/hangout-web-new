import { isAxiosError } from "axios";
import type { SignupResponse } from "../types/model/signup-response";
import type { SignupFormSchema } from "../types/signup";
import axiosInstance from "../utils/axios-instance";
import type { ProblemDetail } from "../types/model/problem-detail";

export async function Signup(creds: SignupFormSchema): Promise<SignupResponse> {
  try {
    const response = await axiosInstance.post(
      "/auth-api/v1/auth/signup",
      creds
    );
    return response.data as SignupResponse;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data) {
        throw error.response.data as ProblemDetail;
      }
    }
    throw error;
  }
}
