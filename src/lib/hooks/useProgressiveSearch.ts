import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FetchPosts } from "../services/post-service";
import type { FetchPostsQueryParams, Post } from "../types/post";
import type { ProblemDetail } from "../types/model/problem-detail";

const INITIAL_MIN_RADIUS: number = 0; // meters
const INITIAL_MAX_RADIUS: number = 5000; // meters (5km)
const RADIUS_INCREMENT: number = 5000; // meters (5km)
const MAX_CONSECUTIVE_EMPTY_EXPANSIONS: number = 5;

export const useProgressiveSearch = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(
    null
  );
  const [minSearchRadius, setMinSearchRadius] = useState(INITIAL_MIN_RADIUS);
  const [maxSearchRadius, setMaxSearchRadius] = useState(INITIAL_MAX_RADIUS);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [consecutiveEmptyExpansions, setConsecutiveEmptyExpansions] =
    useState(0);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [apiError, setApiError] = useState<ProblemDetail>();

  const isInitialLoad = useRef(true);
  const isFetching = useRef(false);

  // Fetch user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("Cannot fetch nearby posts without location permission.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert(
                "Your location is not available at the moment. Please try again later."
              );
              break;
            case error.TIMEOUT:
              alert("Location request timed out. Please try again.");
              break;
            default:
              alert(
                "Something went wrong during fetching your location. Please refresh the page."
              );
              break;
          }
        }
      );
    }
  }, []);

  // API call to fetch posts
  const fetchPosts = useCallback(FetchPosts, []);

  // Expand search radius
  const expandRadius = useCallback(() => {
    setMinSearchRadius(maxSearchRadius);
    setMaxSearchRadius((prev) => prev + RADIUS_INCREMENT);
    setCurrentPage(1);
  }, [maxSearchRadius]);

  // Main search logic
  const searchPosts = useCallback(async () => {
    if (!userLocation || isFetching.current || hasReachedLimit) return;

    isFetching.current = true;
    setIsLoading(true);
    setApiError(undefined); // Clear previous errors

    try {
      const params: FetchPostsQueryParams = {
        lat: userLocation.coords.latitude,
        lon: userLocation.coords.longitude,
        minSearchRadius,
        maxSearchRadius,
        pageNumber: currentPage,
      };

      const data = await fetchPosts(params);

      // Check if content found
      if (data.posts.length > 0) {
        // Content found - reset consecutive empty expansions counter
        setConsecutiveEmptyExpansions(0);

        // Update posts
        setPosts((prev) => [...prev, ...data.posts]);

        // Update pagination info
        setTotalPages(data.totalPages);
      } else {
        // No content found
        if (currentPage === 1) {
          // First page of this radius range is empty - expand
          const newEmptyCount = consecutiveEmptyExpansions + 1;
          setConsecutiveEmptyExpansions(newEmptyCount);

          if (newEmptyCount >= MAX_CONSECUTIVE_EMPTY_EXPANSIONS) {
            // Stop searching after 5 consecutive empty expansions
            setHasReachedLimit(true);
            console.log("Reached maximum search radius with no results");
          } else {
            // Expand and try again
            expandRadius();
          }
        } else {
          // Paginating within current radius but no more content
          // This shouldn't happen if totalPages is correct, but handle it anyway
          console.log("No more content in current page, but not expanding");
        }
      }
    } catch (error) {
      // Handle Problem Detail errors
      if (isProblemDetail(error)) {
        setApiError(error);
        console.error("API Error:", error);
      } else {
        // Handle other errors (network issues, etc.)
        const genericError: ProblemDetail = {
          type: "about:blank",
          title: "Network Error",
          status: 0,
          detail:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        };
        setApiError(genericError);
        console.error("Error fetching posts:", error);
      }
    } finally {
      setIsLoading(false);
      setLoadData(false);
      isFetching.current = false;
    }
  }, [
    userLocation,
    minSearchRadius,
    maxSearchRadius,
    currentPage,
    consecutiveEmptyExpansions,
    hasReachedLimit,
    fetchPosts,
    expandRadius,
  ]);

  // Helper function to check if error is a Problem Detail
  const isProblemDetail = (error: any): error is ProblemDetail => {
    return (
      error &&
      typeof error === "object" &&
      ("type" in error ||
        "title" in error ||
        "status" in error ||
        "detail" in error)
    );
  };

  // Initial load when location is available
  useEffect(() => {
    if (userLocation && isInitialLoad.current) {
      isInitialLoad.current = false;
      searchPosts();
    }
  }, [userLocation, searchPosts]);

  // Trigger search when radius expands
  useEffect(() => {
    if (
      !isInitialLoad.current &&
      userLocation &&
      minSearchRadius > INITIAL_MIN_RADIUS
    ) {
      searchPosts();
    }
  }, [minSearchRadius, maxSearchRadius]);

  // Handle pagination - when user scrolls and needs more data
  useEffect(() => {
    if (
      loadData &&
      !isLoading &&
      !hasReachedLimit &&
      currentPage < totalPages
    ) {
      setCurrentPage((prev) => prev + 1);
    } else if (
      loadData &&
      !isLoading &&
      !hasReachedLimit &&
      currentPage >= totalPages
    ) {
      // Reached end of pages in current radius - expand
      expandRadius();
    }
  }, [
    loadData,
    isLoading,
    hasReachedLimit,
    currentPage,
    totalPages,
    expandRadius,
  ]);

  // Fetch when page number changes (for pagination)
  useEffect(() => {
    if (currentPage > 1 && userLocation && !isInitialLoad.current) {
      searchPosts();
    }
  }, [currentPage]);

  // Calculate trigger element for infinite scroll
  const postToTriggerDataLoad = useMemo(() => {
    if (posts.length > 5) {
      return posts.length - 5;
    } else if (posts.length > 0 && posts.length <= 5) {
      return posts.length - 1; // Last element if 5 or fewer posts
    }
    return undefined;
  }, [posts.length]); // Only depend on length, not entire posts array

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (postToTriggerDataLoad === undefined || hasReachedLimit) return;

    const postElements = document.querySelectorAll(".post-container");
    if (postElements.length === 0) return;

    const triggerElement = postElements[postToTriggerDataLoad];
    if (!triggerElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only trigger if:
        // 1. Element is intersecting
        // 2. Not currently loading
        // 3. Haven't reached the limit
        // 4. Either have more pages OR can expand radius
        if (
          entry.isIntersecting &&
          !isLoading &&
          !hasReachedLimit &&
          (currentPage < totalPages || currentPage >= totalPages)
        ) {
          setLoadData(true);
        }
      },
      {
        threshold: 0.5,
        rootMargin: "100px", // Start loading slightly before element is visible
      }
    );

    observer.observe(triggerElement);

    return () => {
      observer.unobserve(triggerElement);
      observer.disconnect();
    };
  }, [
    postToTriggerDataLoad,
    isLoading,
    hasReachedLimit,
    currentPage,
    totalPages,
  ]);

  return {
    posts,
    isLoading,
    userLocation,
    apiError,
    setApiError,
    hasReachedLimit,
  };
};
