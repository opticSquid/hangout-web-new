import type { Dispatch, SetStateAction } from "react";
import type { Location } from "../location";

export interface ShowLocationProps {
  location: Location;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
