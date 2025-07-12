import type { ReactNode } from "react";
import type { DeviceDetails } from "../device-details";

export interface DeviceDetailsProps {
  children: ReactNode;
  defaultDeviceDetails?: DeviceDetails;
}
