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

type PostContent = {
  postId: string;
  ownerId: number;
  filename: string;
  contentType: string;
  postDescription?: string;
  createdAt: string;
  state: string;
  city: string;
};

export type PostInteractions = {
  hearts: number;
  comments: number;
  interactions: number;
  location: Location;
  distance: number;
};

export type Post = PostContent & PostInteractions;

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

export type PostControls = {
  post: Post;
  canPlayVideo: boolean;
  showDistance: boolean;
};
