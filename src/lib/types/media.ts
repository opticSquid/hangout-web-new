export type AcceptedMediaType =
  | "image/png"
  | "image/jpeg"
  | "image/jpg"
  | "image/gif"
  | "image/webp"
  | "video/mp4"
  | "video/mkv"
  | "video/webm"
  | "video/avi"
  | "video/mov"
  | null;

export type ShakaError = {
  code: number;
  severity: string;
  category: string;
  data: object[];
  handled: boolean;
};
