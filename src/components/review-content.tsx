import type { ReviewContentProps } from "@/lib/types/props/review-content-props";
import { use, useEffect, useState, type ReactElement } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { RotateCcwIcon } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

function ReviewContentComponent(props: ReviewContentProps): ReactElement {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
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

  // On the basis of user's location, find the address details
  useEffect(() => {}, []);
  if (!dataUrl) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="h-full flex flex-col space-y-4 items-center">
        <video
          controls={true}
          autoPlay={true}
          loop={true}
          className="basis-3/4 object-cover"
          src={dataUrl}
        />
        <form className="grow flex flex-col w-full px-2 space-y-4">
          <div className="flex-col space-y-1">
            <Label htmlFor="state" className="text-lg font-semibold">
              State
            </Label>
            <Input id="state" name="state" type="text" />
          </div>
          <div className="flex-col space-y-1">
            <Label htmlFor="city" className="text-lg font-semibold">
              City / Town / Village
            </Label>
            <Input id="city" name="city" type="text" />
          </div>
        </form>
        <div className="flex flex-row justify-between items-center space-x-2 px-2 w-full">
          <Button variant="secondary" size="icon" onClick={props.onRetake}>
            <RotateCcwIcon />
          </Button>
          <Button
            className="grow rounded-3xl"
            onClick={() => props.onAddDescription(description)}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }
}
export default ReviewContentComponent;
