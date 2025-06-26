import type { ShowLocationOnMapsProps } from "@/lib/types/props/show-location-props";
import type { ReactElement } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import MapComponent from "./map";
import type { Position } from "@/lib/types/location";
function ShowLocationOnMapComponent(
  props: ShowLocationOnMapsProps
): ReactElement {
  const position: Position = {
    lat: props.location.coordinates[0],
    lng: props.location.coordinates[1],
  };
  return (
    <Dialog open={props.isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Location</DialogTitle>
        </DialogHeader>
        <MapComponent
          position={position}
          zoomLevel={17}
          isRecenterEnabled={false}
          tailWindHeight="h-6/13"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default ShowLocationOnMapComponent;
