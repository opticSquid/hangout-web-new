import { HeartIcon, MessageCircleIcon, MapPinIcon } from "lucide-react";
import { Button } from "./ui/button";
import type { PostInteractionProps } from "@/lib/types/props/post-interactions-props";
import { useState } from "react";

function PostInteractionsComponent(props: PostInteractionProps) {
  const [hearted, setHearted] = useState<{
    isHearted: boolean;
    heartCount: number;
  }>({ isHearted: false, heartCount: props.heartCount });
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
            <HeartIcon className="size-10 bg-primary rounded-full p-1" />
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
        <Button variant="ghost" size="icon">
          <MapPinIcon className="size-10" />
        </Button>
        <div>{props.distance}&nbsp;km</div>
      </div>
    </div>
  );
}
export default PostInteractionsComponent;
