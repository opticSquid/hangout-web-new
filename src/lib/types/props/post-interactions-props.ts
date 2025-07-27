import type { Location } from "../location";

export interface PostInteractionProps {
  postId: string;
  heartCount: number;
  commentCount: number;
  distance: number;
  location: Location;
  showDistance: boolean;
}
