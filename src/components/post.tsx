import type { PostComponentProps } from "@/lib/types/props/post-component-props";
import type { ReactElement } from "react";
import VideoPlayer from "./video-player";
function PostComponent(props: PostComponentProps): ReactElement {
  return (
    <div
      className="snap-start snap-always h-full post-container"
      post-id={props.post.postId}
    >
      <VideoPlayer
        postId={props.post.postId}
        filename={props.post.filename}
        hostURL={`${import.meta.env.VITE_API_BASE_URL}/processed`}
        showInteractions={true}
        autoPlay={props.canPlayVideo}
        postInteractions={{
          hearts: props.post.hearts,
          comments: props.post.comments,
          distance: props.post.distance,
          interactions: props.post.interactions,
          location: props.post.location,
        }}
      />
    </div>
  );
}

export default PostComponent;
