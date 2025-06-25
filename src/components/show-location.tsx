import type { ShowLocationProps } from "@/lib/types/props/show-location-props";
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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import SetLocationOnMap from "./set-location-on-map";

function ShowLocationComponent(props: ShowLocationProps): ReactElement {
  return (
    <Dialog open={props.isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Location</DialogTitle>
        </DialogHeader>
        <SetLocationOnMap />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default ShowLocationComponent;
