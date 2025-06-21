import type { ShakaError } from "@/lib/types/media";
import type { VideoPlayerProps } from "@/lib/types/props/video-player-props";
import { useEffect, useRef, useState, type ReactElement } from "react";
import "shaka-player/dist/controls.css";
import shaka from "shaka-player/dist/shaka-player.ui.js";

function VideoPlayer(props: VideoPlayerProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoNotAvailable, setVideoNotAvailable] = useState<boolean>(false);

  useEffect(() => {
    const extractedFilename = props.filename.replace(/\.[^.]+$/, "");

    if (!videoRef.current || !containerRef.current) return;

    const player = new shaka.Player();
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
      } else if (error.code === 1003) {
        setVideoNotAvailable(true);
      } else {
        console.error("something wrong with shaka player: ", error);
      }
    };

    player
      .load(`${props.hostURL}/${extractedFilename}/${extractedFilename}.mpd`)
      .then(() => console.log("The video has now been loaded!"))
      .catch(onError);

    return () => {
      player.destroy().catch(console.error);
    };
  }, [props.filename]);

  return (
    <div data-shaka-player-container ref={containerRef} className="h-full">
      <video
        data-shaka-player
        id="video"
        ref={videoRef}
        autoPlay={props.autoPlay}
        loop
        className="aspect-9/16 object-cover"
      />
    </div>
  );
}

export default VideoPlayer;
