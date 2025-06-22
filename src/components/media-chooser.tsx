import {
  CircleIcon,
  CircleStopIcon,
  FolderOpenIcon,
  SwitchCameraIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactElement } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import type { ShootMediaProps } from "@/lib/types/props/choose-media-props";

function MediaChooserComponent(props: ShootMediaProps): ReactElement {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [camera, setCamera] = useState<"user" | "environment">("environment");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [timer, setTimer] = useState<string>("0:00");
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  /** when upload button is clicked activates the input */
  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /** uploads device files to web */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/mkv",
        "video/webm",
        "video/avi",
        "video/mov",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please select a valid image or video file.");
        return;
      }

      if (file.type.startsWith("video")) {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.src = URL.createObjectURL(file);
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > 60) {
            alert("Video duration should be 1 minute or less.");
            return;
          } else {
            const blob = new Blob([file], { type: file.type });
            props.onMediaCaptured(blob);
            console.log("video file uploaded");
          }
        };
      } else {
        const blob = new Blob([file], { type: file.type });
        props.onMediaCaptured(blob);
        console.log("image file uploaded");
      }
    }
  };

  /** Stop recording */
  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
  };

  /** Starting record timer */
  const startTimer = () => {
    let seconds = 0;
    let minutes = 0;
    timerIntervalRef.current = setInterval(() => {
      seconds++;
      if (seconds === 60) {
        console.log("1 min done");
        minutes++;
        seconds = 0;
        stopRecording();
      }
      const formattedTime = `${minutes.toString().padStart(1, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
      setTimer(formattedTime);
    }, 1000);
  };

  /** Start recording using MediaRecorder */
  const startRecording = () => {
    if (!stream.current) return;

    const recorder = new MediaRecorder(stream.current, {
      mimeType: "video/webm",
    });
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.current.push(event.data);
    };

    recorder.onstop = () => {
      const videoBlob = new Blob(recordedChunks.current, {
        type: "video/webm",
      });
      props.onMediaCaptured(videoBlob);
      recordedChunks.current = [];
      mediaRecorder.current = null;
      setIsRecording(false);
      clearInterval(timerIntervalRef.current as NodeJS.Timeout); // Clear the timer
      setTimer("0:00"); // Reset the timer display
    };

    recorder.start();
    mediaRecorder.current = recorder;
    setIsRecording(true);
    startTimer(); // Start the timer when recording begins
  };

  /** Switch camera */
  const switchCamera = () => {
    setCamera((prevState) => (prevState === "user" ? "environment" : "user"));
  };

  /** Stop the Camera */
  const stopCamera = () => {
    if (stream.current) {
      stream.current.getTracks().forEach((track) => track.stop());
      stream.current = null;
    }
  };

  /** Restart camera on mode change */
  useEffect(() => {
    /** Start the camera */
    const startCamera = async () => {
      try {
        // Stop any existing stream before starting a new one
        stopCamera();

        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: camera },
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }

        stream.current = newStream;
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };
    startCamera();
    return () => stopCamera();
  }, [camera]);

  return (
    <div className="h-full flex flex-col items-center">
      {isRecording && (
        <div className="absolute top-1 bg-black/50 rounded-xl px-2 py-1 z-10 font-light">
          <div className="flex flex-row items-center space-x-1 animate-pulse">
            <CircleIcon fill="red" size="12" />
            <span>{timer}</span>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute bottom-14 w-full h-1/12 flex flex-row justify-between items-center px-14">
        <Button
          variant="ghost"
          size="icon"
          className="text-white"
          onClick={handleUploadButtonClick}
        >
          <FolderOpenIcon className="size-10" />
        </Button>
        <Input
          type="file"
          ref={fileInputRef}
          accept="image/*,video/*"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        {isRecording ? (
          <Button onClick={stopRecording} variant="ghost" size="icon">
            <CircleStopIcon
              className="size-10"
              stroke="oklch(0.705 0.213 47.604)"
            />
          </Button>
        ) : (
          <Button onClick={startRecording} variant="ghost" size="icon">
            <CircleIcon
              className="size-10"
              fill="oklch(0.705 0.213 47.604)"
              stroke="oklch(0.98 0.016 73.684)"
            />
          </Button>
        )}
        <Button
          onClick={switchCamera}
          variant="ghost"
          size="icon"
          className="text-white"
        >
          <SwitchCameraIcon className="size-10" />
        </Button>
      </div>
    </div>
  );
}

export default MediaChooserComponent;
