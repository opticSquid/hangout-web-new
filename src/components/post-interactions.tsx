import type { PostInteractionProps } from "@/lib/types/props/post-interactions-props";
import { HeartIcon, MapPinIcon, MessageCircleIcon } from "lucide-react";
import { useState } from "react";
import ShowLocationOnMapComponent from "./show-location-on-map";
import { Button } from "./ui/button";

function PostInteractionsComponent(props: PostInteractionProps) {
  const [hearted, setHearted] = useState<{
    isHearted: boolean;
    heartCount: number;
  }>({ isHearted: false, heartCount: props.heartCount });
  const [isLocationShowed, setIsLocationShowed] = useState<boolean>(false);
  const toggleIsHearted = () => {
    setHearted((prevState) => {
      return {
        isHearted: !prevState.isHearted,
        heartCount: prevState.isHearted
          ? prevState.heartCount - 1
          : prevState.heartCount + 1,
      };
    });
  };
  return (
    <div className="absolute right-2 bottom-20 flex flex-col gap-y-6 z-10">
      <div className="flex flex-col items-center gap-y-2">
        <Button variant="ghost" size="icon" onClick={toggleIsHearted}>
          {hearted.isHearted ? (
            <HeartIcon
              fill="oklch(0.705 0.213 47.604)"
              stroke="oklch(0.705 0.213 47.604)"
              className="size-10"
            />
          ) : (
            <HeartIcon className="size-10" />
          )}
        </Button>
        <div>{hearted.heartCount}</div>
      </div>
      <div className="flex flex-col items-center gap-y-2">
        <Button variant="ghost" size="icon">
          <MessageCircleIcon className="size-10" />
        </Button>
        <div>{props.commentCount}</div>
      </div>
      <div className="flex flex-col items-center gap-y-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsLocationShowed(true)}
        >
          <MapPinIcon className="size-10" />
        </Button>
        <div>{props.distance}&nbsp;km</div>
      </div>
      {isLocationShowed && (
        <ShowLocationOnMapComponent
          location={props.location}
          isOpen={isLocationShowed}
          setIsOpen={setIsLocationShowed}
        />
      )}
    </div>
  );
}
export default PostInteractionsComponent;
