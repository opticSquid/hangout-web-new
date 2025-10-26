import ErrorComponent from "@/components/error";
import LoadingOverlay from "@/components/loading-overlay";
import PostComponent from "@/components/post";
import ProfileHeaderComponent from "@/components/profile-header";
import { Button } from "@/components/ui/button";
import { FetchProfilePictureUrl } from "@/lib/services/content-delivery-service";
import { FetchOwnPostsData } from "@/lib/services/post-service";
import { FetchOwnProfileData } from "@/lib/services/profile-service";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import type { ProfilePost } from "@/lib/types/post";
import type { Profile } from "@/lib/types/profile";
import { Grid3X3Icon, Loader2Icon } from "lucide-react";
import {
  useEffect,
  useMemo,
  useCallback,
  useState,
  type ReactElement,
} from "react";
import { useNavigate } from "react-router"; // or your routing library

function ProfilePage(): ReactElement {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<Profile>();
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>();
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [visiblePostId, setVisiblePostId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<ProblemDetail>();

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loadData, setLoadData] = useState<boolean>(false);

  /**
   * Fetches the user's profile data and initial posts in parallel when the component mounts.
   */
  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      setIsLoading(true);

      try {
        // Fetch profile and posts in parallel
        const [profileResponse, postsResponse] = await Promise.all([
          FetchOwnProfileData(),
          FetchOwnPostsData(1),
        ]);

        // Set profile data
        setProfileData(profileResponse);

        // Set posts data
        setPosts(postsResponse.posts);
        setTotalPages(postsResponse.totalPages);
        if (postsResponse.currentPage < postsResponse.totalPages) {
          setCurrentPage(2); // Next page to fetch
        }
      } catch (error) {
        const problemDetail = error as ProblemDetail;

        // Check if it's a 404 - no profile exists
        if (problemDetail.status === 404) {
          navigate("/new-profile", { replace: true });
        } else {
          setApiError(problemDetail);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [navigate]);

  /**
   * Fetches the user's profile picture URL when the profile data is available.
   */
  useEffect(() => {
    if (!profileData?.profilePicture) return;

    const fetchProfilePicture = async () => {
      try {
        const response = await FetchProfilePictureUrl(
          profileData.profilePicture.filename
        );
        setProfilePictureUrl(response.url);
      } catch (error) {
        setApiError(error as ProblemDetail);
      }
    };
    fetchProfilePicture();
  }, [profileData?.profilePicture]);

  /**
   * Fetches posts from API and stores them in state (for pagination)
   */
  const fetchPosts = useCallback(async () => {
    if (currentPage > totalPages && totalPages !== 0) return;

    try {
      setIsLoading(true);

      // Fetch from API
      const response = await FetchOwnPostsData(currentPage);

      // Add new posts to state
      setPosts((prev) => [...prev, ...response.posts]);

      // Update pagination state
      setTotalPages(response.totalPages);

      // Move to next page if available
      if (response.currentPage < response.totalPages) {
        setCurrentPage((prev) => prev + 1);
      }
    } catch (error) {
      setApiError(error as ProblemDetail);
    } finally {
      setIsLoading(false);
      setLoadData(false);
    }
  }, [currentPage, totalPages]);

  /**
   * Load more posts when triggered by scroll (skips first page since it's loaded initially)
   */
  useEffect(() => {
    if (loadData && !isLoading && currentPage > 1) {
      fetchPosts();
    }
  }, [loadData, isLoading, currentPage, fetchPosts]);

  /**
   * Calculate trigger element for infinite scroll
   */
  const postToTriggerDataLoad = useMemo(() => {
    const successPosts = posts.filter(
      (post) => post.processStatus === "SUCCESS"
    );
    if (successPosts.length > 5) {
      return successPosts.length - 5;
    } else if (successPosts.length > 0 && successPosts.length <= 5) {
      return successPosts.length - 1;
    }
    return undefined;
  }, [posts]);

  /**
   * Intersection observer for infinite scroll
   */
  useEffect(() => {
    if (postToTriggerDataLoad === undefined || currentPage > totalPages) return;

    const postElements = document.querySelectorAll(".post-container");
    if (postElements.length === 0) return;

    const triggerElement = postElements[postToTriggerDataLoad];
    if (!triggerElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          setLoadData(true);
        }
      },
      {
        threshold: 0.5,
        rootMargin: "100px",
      }
    );

    observer.observe(triggerElement);
    return () => {
      observer.unobserve(triggerElement);
      observer.disconnect();
    };
  }, [postToTriggerDataLoad, isLoading, currentPage, totalPages]);

  /**
   * Autoplay visible video
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

  useEffect(() => {
    const postElements = document.querySelectorAll(".post-container");
    if (postElements.length === 0) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });

    postElements.forEach((el) => observer.observe(el));
    return () => {
      postElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [posts.length, handleIntersection]);

  // Filtered posts
  const successPosts = useMemo(
    () => posts.filter((post) => post.processStatus === "SUCCESS"),
    [posts]
  );

  const processingCount = useMemo(
    () => posts.filter((post) => post.processStatus !== "SUCCESS").length,
    [posts]
  );

  // Loading state - no profile yet
  if (!profileData && isLoading) {
    return <LoadingOverlay message="Loading profile..." />;
  }

  // This shouldn't render because we redirect in useEffect, but keep as fallback
  if (!profileData && !isLoading) {
    return <div />;
  }

  return (
    <div className="flex flex-col h-full">
      <ProfileHeaderComponent
        profilePictureBaseUrl={profilePictureUrl}
        name={profileData!.name}
      />

      <div className="flex flex-row border-t border-b justify-center">
        <Button variant="ghost" size="icon">
          <Grid3X3Icon />
          &nbsp;POSTS
        </Button>
      </div>

      {/* Processing indicator */}
      {processingCount > 0 && (
        <div className="flex flex-row items-center space-x-1 p-1 bg-secondary">
          <Loader2Icon
            className="h-5 w-5 animate-spin text-primary"
            strokeWidth={5}
          />
          <span className="text font-light">
            {processingCount} post{processingCount > 1 ? "s are" : " is"} being
            processed...
          </span>
        </div>
      )}

      {/* Posts section */}
      <section className="overflow-y-auto scrollbar-hide scroll-smooth snap-y snap-mandatory">
        {successPosts.length > 0 ? (
          successPosts.map((post) => (
            <PostComponent
              key={post.postId}
              post={{
                city: post.city,
                comments: post.comments,
                createdAt: post.createdAt,
                distance: -1,
                postId: post.postId,
                filename: post.filename,
                hearts: post.hearts,
                interactions: post.interactions,
                location: post.location,
                ownerId: profileData!.userId,
                state: post.state,
              }}
              canPlayVideo={post.postId === visiblePostId}
              showDistance={false}
              twHeightClassName="h-full"
            />
          ))
        ) : !isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No posts yet</p>
          </div>
        ) : null}
      </section>

      {/* Loading overlay */}
      {isLoading && posts.length > 0 && (
        <LoadingOverlay message="Loading more posts..." />
      )}

      {/* Error handling */}
      {apiError && <ErrorComponent error={apiError} setError={setApiError} />}
    </div>
  );
}

export default ProfilePage;
