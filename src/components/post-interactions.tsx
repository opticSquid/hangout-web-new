import { useAccessTokenContextObject } from "@/lib/hooks/useAccessToken";
import { HeartStatus, UpdateHeartCount } from "@/lib/services/heart-service";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import type { PostInteractionProps } from "@/lib/types/props/post-interactions-props";
import { HeartIcon, MapPinIcon, MessageCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ShowLocationOnMapComponent from "./show-location-on-map";
import { Button } from "./ui/button";
import ErrorComponent from "./error";

function PostInteractionsComponent(props: PostInteractionProps) {
  const accessTokenObject = useAccessTokenContextObject();
  const navigate = useNavigate();
  const [hearted, setHearted] = useState<{
    isHearted: boolean;
    heartCount: number;
  }>({ isHearted: false, heartCount: props.heartCount });
  useEffect(() => {
    const checkHeartStatus = async () => {
      const res = await HeartStatus({ postId: props.postId });
      setHearted({ ...hearted, isHearted: res.hasHearted });
    };
    checkHeartStatus();
  }, []);
  const [isLocationShowed, setIsLocationShowed] = useState<boolean>(false);
  const [apiError, setApiError] = useState<ProblemDetail>();
  const toggleIsHearted = async () => {
    if (accessTokenObject === null) {
      navigate("/");
    } else {
      const currentHeartCount = hearted.isHearted
        ? hearted.heartCount - 1
        : hearted.heartCount + 1;
      try {
        await UpdateHeartCount(currentHeartCount > hearted.heartCount, {
          postId: props.postId,
        });
        setHearted((prevState) => {
          return {
            isHearted: !prevState.isHearted,
            heartCount: currentHeartCount,
          };
        });
      } catch (error: any) {
        error = error as ProblemDetail;
        setApiError(error);
      }
    }
  };
  return (
    <div className="absolute right-2 bottom-20 flex flex-col gap-y-6 z-10">
      <div className="flex flex-col items-center gap-y-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleIsHearted}
          disabled={accessTokenObject === null}
        >
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
        <div>
          {props.distance < 1000 ? "< 1" : (props.distance / 1000).toFixed(2)}
          &nbsp;km
        </div>
      </div>
      {isLocationShowed && (
        <ShowLocationOnMapComponent
          location={props.location}
          isOpen={isLocationShowed}
          setIsOpen={setIsLocationShowed}
        />
      )}
      {apiError && <ErrorComponent error={apiError} setError={setApiError} />}
    </div>
  );
}
export default PostInteractionsComponent;
