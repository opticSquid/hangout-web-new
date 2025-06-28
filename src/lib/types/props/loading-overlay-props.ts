import type { HTMLAttributes } from "react";

export interface LoadingOverlayProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
}
