import type { AcceptedMediaType } from "../media";

export interface ReviewContentProps {
  blob: Blob;
  mediaType: AcceptedMediaType;
  onRetake: () => void;
  onAddDescription: (description: string) => void;
}
