import type { PostInteractions } from "../post";

export interface VideoPlayerProps {
  videoProps: videoProps;
  interactionProps: interactionProps;
}

interface videoProps {
  hostURL: string;
  filename: string;
  autoPlay: boolean;
}
interface interactionProps {
  postInteractions: PostInteractions;
  postId: string;
  showDistance: boolean;
}
