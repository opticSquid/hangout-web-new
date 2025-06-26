import SetLocationOnMapComponent from "@/components/set-location-on-map";
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

  async function onSubmit(lat: number, lon: number) {
    const url = description
      ? `${process.env.NEXT_PUBLIC_POST_API_URL}/post/full`
      : `${process.env.NEXT_PUBLIC_POST_API_URL}/post/short`;

    const formData = new FormData();
    const jsonOptions = { type: "application/json" };

    console.log("Original blob type: ", media?.type);

    formData.append(
      "file",
      media!,
      mediaType === "image/jpeg" ? "uploaded-media.jpg" : "uploaded-media.webm"
    );

    formData.append("lat", lat.toString());
    formData.append("lon", lon.toString());

    if (description) {
      formData.append(
        "postDescription",
        new Blob([JSON.stringify(description)], jsonOptions)
      );
    }

    for (const [key, value] of formData.entries()) {
      if (value instanceof Blob) {
        console.log(`FormData entry [${key}]:`, value, "Type:", value.type);
      } else {
        console.log(`FormData entry [${key}]:`, value);
      }
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        // Authorization: `Bearer ${sessionState.accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      alert("Posting Failed");
    }
  }

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
    case 2: {
      return <SetLocationOnMapComponent onSubmit={onSubmit} />;
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
