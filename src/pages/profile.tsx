import ErrorComponent from "@/components/error";
import LoadingOverlay from "@/components/loading-overlay";
import PostComponent from "@/components/post";
import ProfileHeaderComponent from "@/components/profile-header";
import { Button } from "@/components/ui/button";
import { LoadNPosts, SavePostsToDB } from "@/lib/db/my-posts-db";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { FetchOwnPostsData } from "@/lib/services/post-service";
import { FetchOwnProfileData } from "@/lib/services/profile-service";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import type { PagePointer, ProfilePost } from "@/lib/types/post";
import type { Profile } from "@/lib/types/profile";
import { Grid3X3Icon } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";

function ProfilePage(): ReactElement {
  const isLoggedIn = useAuthGuard();
  const [loadData, setLoadData] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<Profile>();
  const pageNumber = useRef<number>(1);
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [visiblePostId, setVisiblePostId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<ProblemDetail>();
  const limit: number = 3;
  const offset = useRef<number>(0);

  /**
   * Fetches the user's profile data when the component mounts.
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await FetchOwnProfileData();
        setProfileData(response);
      } catch (error: any) {
        error = error as ProblemDetail;
        setApiError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const changePageNumber = (pagePointer: PagePointer) => {
    if (pagePointer.currentPage < pagePointer.totalPages) {
      pageNumber.current++;
    }
  };

  /**
   * Fetches the user's posts data when the component mounts and when the page number changes.
   * It also saves the posts to the database and loads them from the database.
   */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await FetchOwnPostsData(pageNumber.current);
        await SavePostsToDB(response.posts);
        changePageNumber({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
        });
        const nextPosts = await LoadNPosts(offset.current, limit);
        setPosts((prevState) => [...prevState, ...nextPosts]);
        offset.current = offset.current + nextPosts.length;
      } catch (error: any) {
        const err = error as ProblemDetail;
        setApiError(err);
      }
    };
    if (loadData === true) {
      setIsLoading(true);
      fetchPosts().finally(() => {
        setIsLoading(false);
        setLoadData(false);
      });
    }
  }, [loadData]);

  /**
   * Calculates the 5th last element of the list. When that elment becomes visible it triggers additional data load
   */
  const postToTriggerDataLoad = useMemo(() => {
    if (posts.length > 0 && posts.length > 5) {
      return posts.length - 5;
    } else if (posts.length > 0 && posts.length <= 5) {
      return 0;
    } else {
      return undefined;
    }
  }, [posts]);

  /**
   * Watches the 5th last element of the list. when that is visible, starts to load additional posts in background
   */
  useEffect(() => {
    const postElements = document.querySelectorAll(".post-container");
    if (postToTriggerDataLoad !== undefined && postElements.length > 0) {
      const triggerElement = postElements[postToTriggerDataLoad];
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setLoadData(true);
          }
        },
        { threshold: 0.5 }
      );

      if (triggerElement) observer.observe(triggerElement);
      return () => observer.unobserve(triggerElement);
    }
  }, [postToTriggerDataLoad]);

  /**
   * autoplays the currently visible video and pauses others
   */
  useEffect(() => {
    const postElements = document.querySelectorAll(".post-container");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisiblePostId(entry.target.getAttribute("post-id"));
          }
        });
      },
      { threshold: 0.5 }
    );

    postElements.forEach((el) => observer.observe(el));
    return () => postElements.forEach((el) => observer.unobserve(el));
  }, [postToTriggerDataLoad]);

  return isLoggedIn && profileData !== undefined ? (
    <div className="flex flex-col h-full">
      <ProfileHeaderComponent
        profilePictureBaseUrl={`${
          import.meta.env.VITE_API_BASE_URL
        }/profile-photos/${profileData.profilePicture.filename}`}
        name={profileData.name}
      />
      <div className="flex flex-row border-t border-b justify-center">
        <Button variant="ghost" size="icon">
          <Grid3X3Icon />
          &nbsp;POSTS
        </Button>
      </div>
      <section className="overflow-y-auto scrollbar-hide scroll-smooth snap-y snap-mandatory">
        {posts
          .filter((post) => post.processStatus === "SUCCESS")
          .map((post) => (
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
                ownerId: profileData.userId,
                state: post.state,
              }}
              canPlayVideo={post.postId === visiblePostId}
              showDistance={false}
              twHeightClassName="h-full"
            />
          ))}
      </section>
      {isLoading && <LoadingOverlay message="Loading Profile..." />}
      {apiError && <ErrorComponent error={apiError} setError={setApiError} />}
    </div>
  ) : (
    <div></div>
  );
}
export default ProfilePage;
