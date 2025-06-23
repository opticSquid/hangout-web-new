import type { AddLocationProps } from "@/lib/types/props/add-location-props";
import L from "leaflet";
import { LocateFixedIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import "./stylesheets/map.css";
function MapComponent(props: AddLocationProps) {
  const navigate = useNavigate();
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
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

  // Component to recenter map when position changes
  const RecenterMap = ({
    position,
  }: {
    position: { lat: number; lng: number };
  }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(position, map.getZoom());
    }, [position, map]);
    return null;
  };

  // Default marker icon fix for Leaflet in React
  const defaultIcon = new L.Icon({
    iconUrl: "/icons/marker-icon.png",
    shadowUrl: "/icons/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  //Location Marker
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
      },
    });

    return position ? <Marker position={position} icon={defaultIcon} /> : null;
  };

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
      <MapContainer center={position} zoom={17} className="h-11/13">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap position={position} />
        <LocationMarker />
      </MapContainer>
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
export default MapComponent;
