import type { Location } from "./location";

export type PagePointer = {
  currentPage: number;
  totalPages: number;
};

export type FetchPostsRq = {
  lat: number;
  lon: number;
  minSearchRadius: number;
  maxSearchRadius: number;
  pageNumber: number;
};

export type Post = {
  postId: string;
  ownerId: number;
  filename: string;
  contentType: string;
  postDescription?: string;
  hearts: number;
  comments: number;
  interactions: number;
  createdAt: string;
  state: string;
  city: string;
  location: Location;
  distance: number;
};

export type FetchPostsRs = {
  posts: Post[];
  totalPages?: number;
};

export type PostOwner = {
  name: string;
  photo: string;
  category?: string;
  state: string;
  city: string;
  distance: number;
  location: Location;
};

export type PostInteraction = {
  postId: string;
  heartCount: number;
  commentCount: number;
  interactionCount: number;
};

export type PostControls = {
  post: Post;
  canPlayVideo: boolean;
  showDistance: boolean;
};
