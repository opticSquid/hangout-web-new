import type { Dispatch, ReactElement, SetStateAction } from "react";
import type { ProblemDetail } from "../model/problem-detail";

export interface ErrorComponentProps {
  error?: ProblemDetail;
  setError: Dispatch<SetStateAction<ProblemDetail | undefined>>;
  children?: ReactElement;
}
