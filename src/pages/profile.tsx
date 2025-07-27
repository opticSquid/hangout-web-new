import ErrorComponent from "@/components/error";
import LoadingOverlay from "@/components/loading-overlay";
import PostComponent from "@/components/post";
import ProfileHeaderComponent from "@/components/profile-header";
import { Button } from "@/components/ui/button";
import { useAccessTokenContextObject } from "@/lib/hooks/useAccessToken";
import { FetchOwnPostsData } from "@/lib/services/post-service";
import { FetchOwnProfileData } from "@/lib/services/profile-service";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import type { Post } from "@/lib/types/post";
import type { Profile } from "@/lib/types/profile";
import { Grid3X3Icon } from "lucide-react";
import { useEffect, useMemo, useState, type ReactElement } from "react";

function ProfilePage(): ReactElement {
  const accessTokenObject = useAccessTokenContextObject();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<Profile>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [visiblePostId, setVisiblePostId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<ProblemDetail>();

  /**
   * Fetches the user's profile and posts data when the component mounts.
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await FetchOwnProfileData();
        setProfileData(response);
      } catch (error: any) {
        error = error as ProblemDetail;
        setApiError(error);
      }
    };
    const fetchPosts = async () => {
      try {
        const response = await FetchOwnPostsData();
        setPosts(response);
      } catch (error: any) {
        error = error as ProblemDetail;
        setApiError(error);
      }
    };

    // set isLoading to true before running Promise.all and reset it to false after both promises resolve
    setIsLoading(true);
    Promise.all([fetchProfile(), fetchPosts()]).finally(() =>
      setIsLoading(false)
    );
  }, []);

  const profilePictureUrl =
    profileData != undefined
      ? `${import.meta.env.VITE_API_BASE_URL}/profile-photos/${
          profileData.profilePicture.filename
        }`
      : undefined;

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

  return accessTokenObject.accessToken !== null && profileData !== undefined ? (
    <div className="flex flex-col h-full">
      <ProfileHeaderComponent
        profilePictureBaseUrl={profilePictureUrl}
        name={profileData.name}
      />
      <div className="flex flex-row border-t border-b justify-center">
        <Button variant="ghost" size="icon">
          <Grid3X3Icon />
          &nbsp;POSTS
        </Button>
      </div>
      <section className="overflow-y-auto scroll-smooth snap-y snap-mandatory">
        {posts.map((post) => (
          <PostComponent
            key={post.postId}
            post={post}
            canPlayVideo={post.postId === visiblePostId}
            showDistance={false}
            twHeightClassName="h-full"
          />
        ))}
      </section>
      {isLoading && <LoadingOverlay message="Loading profile..." />}
      {apiError && <ErrorComponent error={apiError} setError={setApiError} />}
    </div>
  ) : (
    <div></div>
  );
}
export default ProfilePage;
