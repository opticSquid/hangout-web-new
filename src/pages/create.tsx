import MediaChooserComponent from "@/components/media-chooser";
import ReviewContentComponent from "@/components/review-content";
import type { AcceptedMediaType } from "@/lib/types/media";
import { useState, type ReactElement } from "react";

function CreatePage(): ReactElement {
  const [step, setStep] = useState<number>(0);
  const [media, setMedia] = useState<Blob | null>(null);
  const [mediaType, setMediaType] = useState<AcceptedMediaType>(null);
  const [description, setDescription] = useState<string>("");
  const proceedToNextStep = () => {
    setStep((prevState: number) => prevState + 1);
  };

  const onMediaCaptured = (mediaBlob: Blob) => {
    setMedia(mediaBlob);
    setMediaType(mediaBlob.type as AcceptedMediaType);
    proceedToNextStep();
  };

  const onRetake = () => {
    setMedia(null);
    setMediaType(null);
    setStep(1);
  };
  const onAddDescription = (description: string) => {
    setDescription(description);
    proceedToNextStep();
  };
  switch (step) {
    case 0: {
      return (
        <div className="h-full">
          <MediaChooserComponent onMediaCaptured={onMediaCaptured} />
        </div>
      );
    }
    case 1: {
      if (media && mediaType) {
        return (
          <ReviewContentComponent
            blob={media}
            mediaType={mediaType}
            onRetake={onRetake}
            onAddDescription={onAddDescription}
          />
        );
      } else {
        setStep(1);
        return <MediaChooserComponent onMediaCaptured={onMediaCaptured} />;
      }
    }
    default: {
      return (
        <div className="h-full">
          <MediaChooserComponent onMediaCaptured={onMediaCaptured} />
        </div>
      );
    }
  }
}

export default CreatePage;
