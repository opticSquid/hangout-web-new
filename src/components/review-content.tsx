import type { ReviewContentProps } from "@/lib/types/props/review-content-props";
import { useEffect, useState, type ReactElement } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { RotateCcwIcon } from "lucide-react";

function ReviewContentComponent(props: ReviewContentProps): ReactElement {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
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
  if (!dataUrl) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="h-full flex flex-col space-y-4 items-center">
        <video
          controls={true}
          autoPlay={true}
          loop={true}
          className="h-full object-cover"
          src={dataUrl}
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={117}
          placeholder="describe your post (optional)"
          className="w-11/12 bg-secondary"
        />
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
