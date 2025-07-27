import type { Location } from "./location";

export type PagePointer = {
  currentPage: number;
  totalPages: number;
};

export type SearchParams = {
  minSearchRadius: number;
  maxSearchRadius: number;
  pageNumber: number;
};
export type FetchPostsQueryParams = {
  lat: number;
  lon: number;
} & SearchParams;

type PostContent = {
  postId: string;
  ownerId: number;
  filename: string;
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

export type PostList = {
  posts: Post[];
} & PagePointer;

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

export type HeartSchema = {
  postId: string;
};

export type NewPostRs = {
  postId: string;
};

export type ProfilePost = {
  processStatus: "IN_QUEUE" | "PROCESSING" | "SUCCESS" | "FAIL";
  interactions: number;
  hearts: number;
  comments: number;
  city: string;
  postId: string;
  createdAt: string;
  filename: string;
  location: Location;
  state: string;
};

export type ProfilePostList = {
  posts: ProfilePost[];
} & PagePointer;
