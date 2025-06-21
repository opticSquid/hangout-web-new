import type { AcceptedMediaType } from "../media";

export interface AddContentDescriptionProps {
  blob: Blob;
  mediaType: AcceptedMediaType;
  onRetake: () => void;
  onAddDescription: (description: string) => void;
}
