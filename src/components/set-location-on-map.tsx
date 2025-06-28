import type { Position } from "@/lib/types/location";
import type { AddLocationProps } from "@/lib/types/props/add-location-props";
import { LocateFixedIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import MapComponent from "./map";
import "./stylesheets/map.css";
import { Button } from "./ui/button";
function SetLocationOnMapComponent(props: AddLocationProps) {
  const navigate = useNavigate();
  const [position, setPosition] = useState<Position>({
    lat: 0,
    lng: 0,
  });
  const [locateMe, setLocateMe] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  // detect user's current location
  useEffect(() => {
    if (navigator.geolocation && locateMe) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(`detecting location. time: ${new Date().toISOString()}`);
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            alert("Location Permission Denied, Cannot Post");
          }
        }
      );
    }
    setLocateMe(false);
  }, [locateMe]);

  // cancel post creation
  const doCancel = () => {
    navigate("/");
  };

  // create post
  const doPost = async () => {
    setLoading(true);
    await props.onSubmit(position.lat, position.lng);
    setLoading(false);
    navigate("/");
  };
  return (
    <div className="h-full">
      <MapComponent
        position={position}
        zoomLevel={17}
        setPosition={setPosition}
        isRecenterEnabled={true}
        className="h-11/13"
      />
      <div className="flex flex-col w-full gap-y-2 px-2 mt-2">
        <Button
          variant="secondary"
          size="lg"
          disabled={loading}
          className="flex flex-row items-center justify-center"
          onClick={() => setLocateMe(true)}
        >
          <div>
            <LocateFixedIcon />
          </div>
          <div>Locate Me</div>
        </Button>
        <div className="flex flex-row gap-x-2">
          <Button variant="destructive" onClick={doCancel}>
            Cancel
          </Button>
          <Button
            className="grow rounded-3xl"
            onClick={doPost}
            disabled={loading}
          >
            Post
            {loading && (
              <div className="w-6 h-6 border-4 border-t-4 border-onPrimaryContainer rounded-full animate-spin border-t-primary-foreground" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
export default SetLocationOnMapComponent;
