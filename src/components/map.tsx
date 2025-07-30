import type { MapComponentProps } from "@/lib/types/props/map-component-props";
import { cn } from "@/lib/utils/utils";
import L from "leaflet";
import { useEffect, type ReactElement } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

function MapComponent(props: MapComponentProps): ReactElement {
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
        props.setPosition?.({ lat, lng }); // call if setPosition exists
      },
    });

    return props.position ? (
      <Marker position={props.position} icon={defaultIcon} />
    ) : null;
  };

  return (
    <MapContainer
      center={props.position}
      zoom={props.zoomLevel}
      className={cn(props.className)}
      doubleClickZoom={true}
      bounceAtZoomLimits={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {props.isRecenterEnabled && <RecenterMap position={props.position} />}
      <LocationMarker />
    </MapContainer>
  );
}
export default MapComponent;
