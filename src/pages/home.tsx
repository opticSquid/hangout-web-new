import { useEffect, useMemo, useState } from "react";
import useFeedUtils from "../lib/hooks/feed-utils";
import type { Post } from "../lib/types/posts";
import PostComponent from "@/components/post";

function HomePage() {
  const { fetchPosts } = useFeedUtils();
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(
    null
  );
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [postList, setPostList] = useState<Post[]>([]);
  const [visiblePostId, setVisiblePostId] = useState<string | null>(null);
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

  // Fetches data given user's location
  useEffect(() => {
    async function fetchData() {
      if (userLocation != null) {
        for (let i = 0; i < 5; i++) {
          const response = await fetchPosts(userLocation);
          if (response.data) {
            if (response.data.posts.length > 0) {
              setPostList((prevState) => {
                return [...prevState, ...(response.data?.posts || [])];
              });
              setLoadingData(false);
              break;
            }
          } else {
            console.error("error fetchig posts");
            setLoadingData(false);
            break;
          }
        }
      }
    }
    if (loadingData) {
      fetchData();
    }
  }, [location, loadingData, fetchPosts]);

  /**
   * Calculates the 75% th element of the list. When that elment becomes visible it triggers additional data load
   */
  const postToTriggerDataLoad = useMemo(
    () => Math.floor(postList.length * 0.75),
    [postList]
  );

  /**
   * Watches the 75% th element of the list. when that is visible, starts to load additional posts in background
   */
  useEffect(() => {
    const posts = document.querySelectorAll(".post-container");
    if (posts.length > 0) {
      const triggerElement = posts[postToTriggerDataLoad];
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setLoadingData(true);
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

  const dummyPost: Post = {
    postId: "a",
    ownerId: 0,
    filename:
      "531530e17baa69d03de1d4b4135e76a2a0eab9a85d76c851b3616a791a6463b3498023aad9144d0236ee941befb09b1c87b17e2091912cd407a88332846f3f8e.mpd",
    contentType: "video/mp4",
    postDescription: "description",
    hearts: 0,
    comments: 0,
    interactions: 0,
    createdAt: "2025-06-21T14:45:30.123Z",
    state: "West Bengal",
    city: "Kolkata",
    location: {
      type: "Point",
      crs: {
        type: "name",
        properties: {
          name: "EPSG:4326",
        },
      },
      coordinates: [0, 0],
    },
    distance: 124,
  };
  return (
    <section className="h-full overflow-y-auto scroll-smooth snap-y snap-mandatory">
      <PostComponent {...dummyPost} />
      <PostComponent {...dummyPost} />
      <PostComponent {...dummyPost} />
    </section>
  );
}
export default HomePage;
