import type { Post } from "@/lib/types/posts";
import type { ReactElement } from "react";
import VideoPlayer from "./video-player";
function PostComponent(props: Post): ReactElement {
  return (
    <div className="snap-start snap-always h-full">
      <VideoPlayer
        filename={props.filename}
        hostURL="http://localhost:9000/processed"
        autoPlay={true}
        postInteractions={{
          hearts: props.hearts,
          comments: props.comments,
          distance: props.distance,
          interactions: props.interactions,
          location: props.location,
        }}
      />
    </div>
  );
}

export default PostComponent;
