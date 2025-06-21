import type { PostInteractions } from "../posts";

export interface VideoPlayerProps {
  hostURL: string;
  filename: string;
  autoPlay: boolean;
  postInteractions: PostInteractions;
}
