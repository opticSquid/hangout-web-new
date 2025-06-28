import type { Dispatch, SetStateAction } from "react";
import type { Position } from "../location";

export interface MapComponentProps {
  position: Position;
  zoomLevel: number;
  setPosition?: Dispatch<SetStateAction<Position>>;
  isRecenterEnabled: boolean;
  className?: string;
}
