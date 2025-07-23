import { useCallback, useRef } from "react";
import type { ApiResponse } from "../types/model/api-response";
import type { FetchPostsQueryParams, PagePointer } from "../types/post";
import type { PostList } from "../types/post";
import type { SearchRadius } from "../types/location";

export default function useFeedUtils() {
  const searchRadius = useRef<SearchRadius>({ min: 0, max: 5000 });
  const pagePointer = useRef<PagePointer>({ currentPage: 1, totalPages: 0 });

  const increaseSearchRadius = () => {
    searchRadius.current = {
      min: searchRadius.current.max,
      max: searchRadius.current.max + 1000,
    };
  };

  const resetPagePointer = () => {
    pagePointer.current = { currentPage: 1, totalPages: 0 };
  };

  const fetchPosts = useCallback(
    async (location: GeolocationPosition): Promise<ApiResponse<PostList>> => {
      const rqBody: FetchPostsQueryParams = {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        minSearchRadius: searchRadius.current.min,
        maxSearchRadius: searchRadius.current.max,
        pageNumber: pagePointer.current.currentPage,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_POST_API_URL}/post/near-me`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rqBody),
        }
      );

      if (!response.ok) {
        return {
          error: { message: "Could not fetch posts", status: response.status },
        };
      }

      const posts: PostList = await response.json();

      if (posts.totalPages !== undefined) {
        if (posts.totalPages <= 1) {
          increaseSearchRadius();
        } else {
          pagePointer.current = {
            currentPage: pagePointer.current.currentPage + 1,
            totalPages: posts.totalPages,
          };
        }
      } else if (
        pagePointer.current.currentPage === pagePointer.current.totalPages
      ) {
        increaseSearchRadius();
        resetPagePointer();
      } else {
        pagePointer.current.currentPage++;
      }

      return { data: posts };
    },
    []
  );

  return { fetchPosts };
}
