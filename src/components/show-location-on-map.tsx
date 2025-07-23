import type { ShowLocationOnMapsProps } from "@/lib/types/props/show-location-props";
import type { ReactElement } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
    lat: props.location.coordinates[1],
    lng: props.location.coordinates[0],
  };
  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={() => props.setIsOpen(!props.isOpen)}
    >
      <DialogContent className="w-4/5 h-3/4 gap-y-4 px-0 py-2">
        <DialogHeader>
          <DialogTitle className="px-2">Location</DialogTitle>
          <DialogDescription className="hidden">
            Location of the Place
          </DialogDescription>
        </DialogHeader>
        <MapComponent
          position={position}
          zoomLevel={17}
          isRecenterEnabled={false}
          className="grow"
        />
        <DialogFooter className="px-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default ShowLocationOnMapComponent;
