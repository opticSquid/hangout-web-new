import type { Location } from "../location";

export interface PostInteractionProps {
  postId: string;
  ownerId: number;
  heartCount: number;
  commentCount: number;
  distance: number;
  location: Location;
  showDistance: boolean;
}
