import type { PostComponentProps } from "@/lib/types/props/post-component-props";
import { useEffect, useState, type ReactElement } from "react";
import VideoPlayer from "./video-player";
import { cn } from "@/lib/utils/utils";
import { FetchSignedCookies } from "@/lib/services/content-delivery-service";
import ErrorComponent from "./error";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
function PostComponent(props: PostComponentProps): ReactElement {
  const [isCookieValid, setIsCookieValid] = useState<boolean>(false);
  const [apiError, setApiError] = useState<ProblemDetail>();
  // Set the cookies for the first time
  useEffect(() => {
    if (!isCookieValid) {
      try {
        FetchSignedCookies(props.post.filename);
        setIsCookieValid(true);
      } catch (error: any) {
        const prblm = error as ProblemDetail;
        setApiError(prblm);
      }
    }
  }, [isCookieValid]);
  return (
    <>
      <div
        className={cn(
          "snap-start snap-always post-container",
          props.twHeightClassName
        )}
        post-id={props.post.postId}
      >
        <VideoPlayer
          videoProps={{
            hostURL: `${import.meta.env.VITE_API_BASE_URL}/processed`,
            filename: props.post.filename,
            autoPlay: props.canPlayVideo,
          }}
          interactionProps={{
            postInteractions: {
              hearts: props.post.hearts,
              comments: props.post.comments,
              distance: props.post.distance,
              interactions: props.post.interactions,
              location: props.post.location,
            },
            postId: props.post.postId,
            ownerId: props.post.ownerId,
            showDistance: props.showDistance,
          }}
          fetchSignedCookies={setIsCookieValid}
        />
      </div>
      {apiError && <ErrorComponent error={apiError} setError={setApiError} />}
    </>
  );
}

export default PostComponent;
