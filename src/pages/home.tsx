import PostComponent from "@/components/post";
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import type {
  SearchParams,
  Post,
  PostList,
  PagePointer,
} from "../lib/types/posts";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import { FetchPosts } from "@/lib/services/fetch-posts";
import { LoadNPosts, SavePostsToDB } from "@/lib/db/index-db";
import LoadingOverlay from "@/components/loading-overlay";
import ErrorComponent from "@/components/error";

function HomePage(): ReactElement {
  const [userLocation, setUserLocation] = useState<GeolocationPosition>();
  const searchParams = useRef<SearchParams>({
    minSearchRadius: 0,
    maxSearchRadius: 5000,
    pageNumber: 1,
  });
  const [loadData, setLoadData] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>();
  const [apiError, setApiError] = useState<ProblemDetail>();
  // const [visiblePostId, setVisiblePostId] = useState<string | null>(null);
  const limit: number = 25;
  const offset = useRef<number>(0);

  // Fetches user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position);
        },
        (error) => {
          if (error.PERMISSION_DENIED) {
            alert("Can not fetch near by posts with out location permission");
          } else if (error.POSITION_UNAVAILABLE) {
            alert(
              "Your location is not available at this moment. Please try again later"
            );
          } else {
            alert(
              "Something went wrong during fetching your location. Please refresh the page. If the error persists try agian later"
            );
          }
        }
      );
    }
  }, []);

  // TODO: define the function
  const tweakSearchParamForNextSearch = (pagePointer: PagePointer) => {};

  // Fetches data given user's location
  useEffect(() => {
    async function fetchData() {
      if (userLocation !== undefined) {
        try {
          setIsLoading(true);
          const data: PostList = await FetchPosts({
            lat: userLocation.coords.latitude,
            lon: userLocation.coords.longitude,
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
          const postList =
            posts !== undefined ? posts.concat(nextPosts) : nextPosts;
          console.log("post list", postList);
          setPosts(postList);
          offset.current = offset.current + limit;
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
   * Calculates the 75% th element of the list. When that elment becomes visible it triggers additional data load
   */
  // const postToTriggerDataLoad = useMemo(() => {
  //   if (posts) {
  //     if (posts.length < 5) {
  //       return 0; // Or handle as an error/special case
  //     }
  //     return posts.length - 5;
  //   } else {
  //     return undefined;
  //   }
  // }, [posts]);

  /**
   * Watches the 75% th element of the list. when that is visible, starts to load additional posts in background
   */
  // useEffect(() => {
  //   const posts = document.querySelectorAll(".post-container");
  //   if (posts.length > 0) {
  //     const triggerElement =
  //       posts[postToTriggerDataLoad ? postToTriggerDataLoad : 0];
  //     const observer = new IntersectionObserver(
  //       ([entry]) => {
  //         if (entry.isIntersecting) {
  //           setLoadData(true);
  //         }
  //       },
  //       { threshold: 0.5 }
  //     );

  //     if (triggerElement) observer.observe(triggerElement);
  //     return () => observer.unobserve(triggerElement);
  //   }
  // }, [postToTriggerDataLoad]);

  /**
   * autoplays the currently visible video and pauses others
   */
  // useEffect(() => {
  //   const postElements = document.querySelectorAll(".post-container");
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           setVisiblePostId(entry.target.getAttribute("post-id"));
  //         }
  //       });
  //     },
  //     { threshold: 0.5 }
  //   );

  //   postElements.forEach((el) => observer.observe(el));
  //   return () => postElements.forEach((el) => observer.unobserve(el));
  // }, [postToTriggerDataLoad]);
  return (
    <>
      <section className="h-full overflow-y-auto scroll-smooth snap-y snap-mandatory">
        {posts !== undefined ? (
          posts.map((post: Post) => (
            <PostComponent key={post.postId} {...post} />
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
