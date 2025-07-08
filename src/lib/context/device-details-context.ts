import { createContext } from "react";
import {
  defaultDeviceDetailsState,
  type DeviceDetailsState as DefaultDeviceDetailsState,
} from "../types/device-details";

export const DeviceDetailsProviderContext =
  createContext<DefaultDeviceDetailsState>(defaultDeviceDetailsState);
