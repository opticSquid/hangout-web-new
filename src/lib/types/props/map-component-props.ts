import type { Dispatch, HTMLAttributes, SetStateAction } from "react";
import type { Position } from "../location";

export interface MapComponentProps extends HTMLAttributes<HTMLDivElement> {
  position: Position;
  zoomLevel: number;
  setPosition?: Dispatch<SetStateAction<Position>>;
  isRecenterEnabled: boolean;
}
