import type { ProblemDetail } from "../types/model/problem-detail";

export function isProblemDetail(obj: unknown): obj is ProblemDetail {
  return (
    typeof obj === "object" &&
    obj !== null &&
    ("title" in obj ||
      "type" in obj ||
      "status" in obj ||
      "detail" in obj ||
      "instance" in obj)
  );
}
