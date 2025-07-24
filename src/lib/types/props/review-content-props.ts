import type { Address } from "../address";
import type { AcceptedMediaType } from "../media";

export interface ReviewContentProps {
  blob: Blob;
  mediaType: AcceptedMediaType;
  onRetake: () => void;
  onAddAddress: (address: Address) => void;
}
