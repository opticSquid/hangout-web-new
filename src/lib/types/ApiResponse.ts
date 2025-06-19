export type ApiResponse<T> = {
  data?: T;
  error?: {
    message: string;
    status: number;
    details?: string;
  };
};
