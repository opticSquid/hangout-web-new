import MediaChooserComponent from "@/components/media-chooser";
import type { AcceptedMediaType } from "@/lib/types/media";
import { useState, type ReactElement } from "react";

function CreatePage(): ReactElement {
  const [media, setMedia] = useState<Blob | null>(null);
  const [mediaType, setMediaType] = useState<AcceptedMediaType>(null);
  const onMediaCaptured = (mediaBlob: Blob) => {
    setMedia(mediaBlob);
    setMediaType(mediaBlob.type as AcceptedMediaType);
  };
  return (
    <div className="h-full">
      <MediaChooserComponent onMediaCaptured={onMediaCaptured} />
    </div>
  );
}

export default CreatePage;
