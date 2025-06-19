import type { AcceptedMediaType } from "./media";

export type AddContentDescriptionProps = {
  blob: Blob;
  mediaType: AcceptedMediaType;
  onRetake: () => void;
  onAddDescription: (description: string) => void;
};
