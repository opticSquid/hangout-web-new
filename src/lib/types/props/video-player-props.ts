import type { Dispatch, SetStateAction } from "react";
import type { PostInteractions } from "../post";

export interface VideoPlayerProps {
  videoProps: videoProps;
  interactionProps: interactionProps;
  isCookiesValid: boolean;
  setIsCookieValid: Dispatch<SetStateAction<boolean>>;
}

interface videoProps {
  hostURL: string;
  filename: string;
  autoPlay: boolean;
}
interface interactionProps {
  postInteractions: PostInteractions;
  postId: string;
  ownerId: number;
  showDistance: boolean;
}
