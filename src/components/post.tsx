import type { PostComponentProps } from "@/lib/types/props/post-component-props";
import type { ReactElement } from "react";
import VideoPlayer from "./video-player";
import { cn } from "@/lib/utils/utils";
function PostComponent(props: PostComponentProps): ReactElement {
  return (
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
          showDistance: props.showDistance,
        }}
      />
    </div>
  );
}

export default PostComponent;
