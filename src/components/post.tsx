import type { Post } from "@/lib/types/posts";
import VideoPlayer from "./video-player";
function PostComponent(props: Post) {
  return (
    <div className="snap-start snap-always h-full">
      <VideoPlayer
        posId={props.postId}
        filename={props.filename}
        hostURL="http://localhost:9000/processed"
        autoPlay={true}
      />
    </div>
  );
}

export default PostComponent;
