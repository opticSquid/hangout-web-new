import type { PostInteractions } from "../post";

export interface VideoPlayerProps {
  hostURL: string;
  filename: string;
  autoPlay: boolean;
  showInteractions: boolean;
  postInteractions: PostInteractions;
  postId: string;
}
