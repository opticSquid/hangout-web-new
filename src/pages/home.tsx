import ErrorComponent from "@/components/error";
import LoadingOverlay from "@/components/loading-overlay";
import NoPostsNearby from "@/components/no-posts-nearby";
import PostComponent from "@/components/post";
import { useProgressiveSearch } from "@/lib/hooks/useProgressiveSearch";
import { useCallback, useEffect, useState, type ReactElement } from "react";
import type { Post } from "../lib/types/post";

function HomePage(): ReactElement {
  const {
    posts,
    isLoading,
    userLocation,
    apiError,
    setApiError,
    hasReachedLimit,
  } = useProgressiveSearch();

  const [visiblePostId, setVisiblePostId] = useState<string | null>(null);

  /**
   * Autoplays the currently visible video and pauses others
   * Memoized callback to prevent recreating on every render
   */
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const postId = entry.target.getAttribute("post-id");
          setVisiblePostId(postId);
        }
      });
    },
    []
  );

  /**
   * Sets up intersection observer for video autoplay
   */
  useEffect(() => {
    const postElements = document.querySelectorAll(".post-container");

    // Early return if no posts
    if (postElements.length === 0) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
      root: null, // viewport
    });

    postElements.forEach((el) => observer.observe(el));

    return () => {
      postElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [posts.length, handleIntersection]); // Depend on posts.length, not postToTriggerDataLoad

  // Loading state - user location
  if (!userLocation) {
    return <LoadingOverlay message="Locating you..." />;
  }

  // Show appropriate message when no posts and not loading
  const shouldShowNoPostsMessage =
    posts.length === 0 && !isLoading && (hasReachedLimit || !userLocation);

  return (
    <>
      <section className="h-full overflow-y-auto scrollbar-hide scroll-smooth snap-y snap-mandatory">
        {posts.length > 0 ? (
          posts.map((post: Post) => (
            <PostComponent
              key={post.postId}
              post={post}
              canPlayVideo={post.postId === visiblePostId}
              showDistance={true}
              twHeightClassName="h-full"
            />
          ))
        ) : shouldShowNoPostsMessage ? (
          <NoPostsNearby />
        ) : null}
      </section>

      {/* Loading overlay - only show when actually loading */}
      {isLoading && posts.length > 0 && (
        <LoadingOverlay message="Loading more posts..." />
      )}

      {/* Initial loading when no posts yet */}
      {isLoading && posts.length === 0 && (
        <LoadingOverlay message="Searching for posts nearby..." />
      )}

      {/* Error handling */}
      {apiError && <ErrorComponent error={apiError} setError={setApiError} />}
    </>
  );
}

export default HomePage;
