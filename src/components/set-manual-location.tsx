import type { Position } from "@/lib/types/location";
import type { AddLocationProps } from "@/lib/types/props/add-location-props";
import { useState } from "react";
import MapComponent from "./map";
import "./stylesheets/map.css";
import { Button } from "./ui/button";
function SetLocationOnMapComponent(props: AddLocationProps) {
  const [position, setPosition] = useState<Position>({
    lat: 22.88976277869987,
    lng: 79.5650313999661,
  });

  const onSubmit = () => {
    props.onSubmit(position.lat, position.lng);
  };

  return (
    <div className="h-full">
      <MapComponent
        position={position}
        zoomLevel={6}
        setPosition={setPosition}
        isRecenterEnabled={true}
        className="h-12/13"
      />
      <div className="flex flex-row w-full gap-x-2 gap-y-2 px-2 mt-2">
        <Button className="grow rounded-3xl" onClick={onSubmit}>
          Set Location
        </Button>
      </div>
    </div>
  );
}
export default SetLocationOnMapComponent;
