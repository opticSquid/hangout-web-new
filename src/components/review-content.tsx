import { FindAddress } from "@/lib/services/address-service";
import type { Address } from "@/lib/types/address";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import type { ReviewContentProps } from "@/lib/types/props/review-content-props";
import { RotateCcwIcon } from "lucide-react";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type ReactElement,
} from "react";
import LoadingOverlay from "./loading-overlay";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import ErrorComponent from "./error";
import { useAccessTokenContextObject } from "@/lib/hooks/useAccessToken";

function ReviewContentComponent(props: ReviewContentProps): ReactElement {
  const accessTokenContextObject = useAccessTokenContextObject();
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<Address>({
    state: "",
    city: "",
  });
  const [apiError, setApiError] = useState<ProblemDetail>();
  // Fetches user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setIsLoading(true);
            const response = await FindAddress(position);
            setAddress(response);
          } catch (error: any) {
            error = error as ProblemDetail;
            setApiError(error);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("Cannot fetch nearby posts without location permission.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert(
                "Your location is not available at the moment. Please try again later."
              );
              break;
            case error.TIMEOUT:
              alert("Location request timed out. Please try again.");
              break;
            default:
              alert(
                "Something went wrong during fetching your location. Please refresh the page. If the error persists, try again later."
              );
              break;
          }
        }
      );
    }
  }, []);
  // Loads video file for preview
  useEffect(() => {
    if (props.blob) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setDataUrl(reader.result as string); // Type assertion for string
      };

      reader.readAsDataURL(props.blob);

      return () => {
        // Cleanup: Abort the reader if the component unmounts
        reader.abort();
      };
    } else {
      setDataUrl(null);
    }
  }, [props.blob]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };
  if (!dataUrl) {
    return <LoadingOverlay message="Loading..." />;
  } else {
    return (
      <div className="h-full flex flex-col items-center">
        <video
          controls={true}
          autoPlay={true}
          loop={true}
          className="grow object-cover"
          src={dataUrl}
        />
        <form
          className="basis-1/4 flex flex-col w-full px-2 space-y-4"
          onSubmit={() => props.onAddAddress(address)}
        >
          <div className="flex-col space-y-1">
            <Label htmlFor="state" className="text-lg font-semibold">
              State
            </Label>
            <Input
              id="state"
              name="state"
              type="text"
              value={address.state}
              onChange={handleChange}
            />
          </div>
          <div className="flex-col space-y-1">
            <Label htmlFor="city" className="text-lg font-semibold">
              City / Town / Village
            </Label>
            <Input
              id="city"
              name="city"
              type="text"
              value={address.city}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-row justify-between space-x-1">
            <Button
              variant="secondary"
              size="icon"
              onClick={props.onRetake}
              type="reset"
            >
              <RotateCcwIcon />
            </Button>
            <Button
              className="grow rounded-3xl"
              type="submit"
              disabled={
                isLoading || accessTokenContextObject.accessToken === null
              }
            >
              Next
            </Button>
          </div>
        </form>
        {isLoading && <LoadingOverlay message="Finding your addres..." />}
        {apiError && <ErrorComponent error={apiError} setError={setApiError} />}
      </div>
    );
  }
}
export default ReviewContentComponent;
