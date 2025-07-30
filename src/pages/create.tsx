import ErrorComponent from "@/components/error";
import LoadingOverlay from "@/components/loading-overlay";
import MediaChooserComponent from "@/components/media-chooser";
import ReviewContentComponent from "@/components/review-content";
import SetLocationOnMapComponent from "@/components/set-location-on-map";
import { AddPost } from "@/lib/services/post-service";
import type { Address } from "@/lib/types/address";
import type { AcceptedMediaType } from "@/lib/types/media";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import { FormatDate } from "@/lib/utils/date-utils";
import { CheckCircle2Icon } from "lucide-react";
import { useState, type ReactElement } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

function CreatePage(): ReactElement {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(0);
  const [media, setMedia] = useState<Blob | null>(null);
  const [mediaType, setMediaType] = useState<AcceptedMediaType>(null);
  const [address, setAddress] = useState<Address>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<ProblemDetail>();
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
  const onAddAddress = (address: Address) => {
    setAddress(address);
    proceedToNextStep();
  };

  async function onSubmit(lat: number, lon: number) {
    if (media !== null && address !== undefined) {
      const formData = new FormData();
      formData.append("file", media, "uploaded-media.mp4");
      formData.append("lat", lat.toString());
      formData.append("lon", lon.toString());
      formData.append("state", address.state);
      formData.append("city", address.city);
      try {
        setIsLoading(true);
        AddPost(formData)
          .then(() => {
            console.log("2nd step");
            toast.success("Post created successfully!", {
              description: FormatDate(new Date()),
              duration: 3500,
              icon: <CheckCircle2Icon />,
            });
          })
          .then(() => {
            console.log("3rd step");
            navigate("/");
          });
      } catch (error: any) {
        const prblm = error as ProblemDetail;
        setApiError(prblm);
      } finally {
        setIsLoading(false);
      }
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
            onAddAddress={onAddAddress}
          />
        );
      } else {
        setStep(1);
        return <MediaChooserComponent onMediaCaptured={onMediaCaptured} />;
      }
    }
    case 2: {
      return (
        <>
          <SetLocationOnMapComponent onSubmit={onSubmit} />
          {isLoading && <LoadingOverlay message="Posting..." />}
          {apiError && (
            <ErrorComponent error={apiError} setError={setApiError} />
          )}
        </>
      );
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
