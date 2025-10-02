import type { ShakaError } from "@/lib/types/media";
import type { VideoPlayerProps } from "@/lib/types/props/video-player-props";
import { useEffect, useRef, useState, type ReactElement } from "react";
import "shaka-player/dist/controls.css";
// @ts-expect-error I don't know why this description was required by eslint
import shaka from "shaka-player/dist/shaka-player.ui.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import PostInteractionsComponent from "./post-interactions";

function VideoPlayer(props: VideoPlayerProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoNotAvailable, setVideoNotAvailable] = useState<boolean>(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const playerRef = useRef<shaka.Player | null>(null);

  // wait for the video to be visible to load the video
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.25,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }

      playerRef.current?.destroy();
    };
  }, []);

  // load videos
  useEffect(() => {
    if (shouldLoad) {
      const extractedFilename = props.videoProps.filename.replace(
        /\.[^.]+$/,
        ""
      );

      if (!videoRef.current || !containerRef.current) return;

      const player = new shaka.Player();
      playerRef.current = player;
      // @ts-ignore: allow any type for the parameters below
      player.getNetworkingEngine().registerRequestFilter((_, request, __) => {
        request.allowCrossSiteCredentials = true;
      });
      const ui = new shaka.ui.Overlay(
        player,
        containerRef.current,
        videoRef.current
      );
      player.attach(videoRef.current);
      ui.configure({
        controlPanelElements: ["fullscreen"],
      });
      const onError = (error: ShakaError) => {
        if (error.code === 7002) {
          console.warn("Ignoring Shaka timeout error:", error);
          return; // Do nothing
        } else {
          props.fetchSignedCookies(true);
          if (error.code === 1003) {
            setVideoNotAvailable(true);
          } else {
            console.error("something wrong with shaka player: ", error);
          }
        }
      };

      player
        .load(
          `${
            import.meta.env.VITE_API_CDN_URL
          }/${extractedFilename}/${extractedFilename}.mpd`
        )
        .then(() => console.log("The video has now been loaded!"))
        .catch(onError);

      return () => {
        player.destroy().catch(console.error);
      };
    }
  }, [shouldLoad, props.videoProps.filename]);

  useEffect(() => {
    if (props.videoProps.autoPlay) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [props.videoProps.autoPlay]);

  return videoNotAvailable ? (
    <Card>
      <CardHeader>
        <CardTitle>Content Not Available</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          Content may be under processing or is not available at this time.
          Please try again later
        </div>
      </CardContent>
    </Card>
  ) : (
    <div data-shaka-player-container ref={containerRef} className="h-full">
      {shouldLoad && (
        <>
          <video
            data-shaka-player
            id="video"
            ref={videoRef}
            autoPlay={props.videoProps.autoPlay}
            loop
            className="aspect-9/16 object-cover w-full"
          />
          <PostInteractionsComponent
            postId={props.interactionProps.postId}
            ownerId={props.interactionProps.ownerId}
            heartCount={props.interactionProps.postInteractions.hearts}
            commentCount={props.interactionProps.postInteractions.comments}
            distance={props.interactionProps.postInteractions.distance}
            location={props.interactionProps.postInteractions.location}
            showDistance={props.interactionProps.showDistance}
          />
        </>
      )}
    </div>
  );
}

export default VideoPlayer;
