import ErrorComponent from "@/components/error";
import LoadingOverlay from "@/components/loading-overlay";
import PostComponent from "@/components/post";
import { LoadNPosts, SavePostsToDB } from "@/lib/db/index-db";
import { FetchPosts } from "@/lib/services/fetch-posts";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import type {
  PagePointer,
  Post,
  PostList,
  SearchParams,
} from "../lib/types/post";

function HomePage(): ReactElement {
  const [userLocation, setUserLocation] = useState<GeolocationPosition>();
  const searchParams = useRef<SearchParams>({
    minSearchRadius: 0,
    maxSearchRadius: 5000,
    pageNumber: 1,
  });
  const [loadData, setLoadData] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [apiError, setApiError] = useState<ProblemDetail>();
  const [visiblePostId, setVisiblePostId] = useState<string | null>(null);
  const limit: number = 3;
  const offset = useRef<number>(0);

  // Fetches user's location
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
                "Something went wrong during fetching your location. Please refresh the page. If the error persists, try again later."
              );
              break;
          }
        }
      );
    }
  }, []);

  // Tweaks the searchParam object either to get next page on next request or increase search radius
  const tweakSearchParamForNextSearch = (pagePointer: PagePointer) => {
    if (pagePointer.currentPage < pagePointer.totalPages) {
      searchParams.current = {
        ...searchParams.current,
        pageNumber: searchParams.current.pageNumber + 1,
      };
    } else {
      searchParams.current = {
        minSearchRadius: searchParams.current.maxSearchRadius,
        maxSearchRadius:
          searchParams.current.maxSearchRadius +
          searchParams.current.minSearchRadius,
        pageNumber: 1,
      };
    }
  };

  // Fetches data given user's location
  useEffect(() => {
    async function fetchData() {
      if (userLocation !== undefined) {
        try {
          setIsLoading(true);
          const data: PostList = await FetchPosts({
            // lat: userLocation.coords.latitude,
            // lon: userLocation.coords.longitude,
            lat: 22.56753960682342,
            lon: 88.47390058400923,
            minSearchRadius: searchParams.current.minSearchRadius,
            maxSearchRadius: searchParams.current.maxSearchRadius,
            pageNumber: searchParams.current.pageNumber,
          });
          tweakSearchParamForNextSearch({
            currentPage: data.currentPage,
            totalPages: data.totalPages,
          });
          await SavePostsToDB(data.posts);
          const nextPosts = await LoadNPosts(offset.current, limit);
          // const postList =
          //   posts.length > 0 ? posts.concat(nextPosts) : nextPosts;
          setPosts((prevState) => [...prevState, ...nextPosts]);
          offset.current = offset.current + nextPosts.length;
        } catch (error: any) {
          const problem = error as ProblemDetail;
          setApiError(problem);
        } finally {
          setIsLoading(false);
          setLoadData(false);
        }
      }
    }
    if (loadData === true) {
      console.log("loading data, location: ", userLocation);
      fetchData();
    }
  }, [userLocation, loadData]);

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

  return (
    <>
      <section className="h-full overflow-y-auto scroll-smooth snap-y snap-mandatory">
        {posts.length !== 0 ? (
          posts.map((post: Post) => (
            <PostComponent
              key={post.postId}
              {...{ post: post, canPlayVideo: post.postId === visiblePostId }}
            />
          ))
        ) : (
          <div>no posts</div>
        )}
      </section>
      {isLoading && <LoadingOverlay message="Loading posts..." />}
      <ErrorComponent error={apiError} setError={setApiError} />
    </>
  );
}
export default HomePage;
