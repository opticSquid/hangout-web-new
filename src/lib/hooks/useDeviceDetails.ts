import { useContext } from "react";
import type { DeviceDetails } from "../types/device-details";
import { DeviceDetailsProviderContext } from "../context/device-details-context";

export const useDeviceDetails = (): DeviceDetails => {
  const context = useContext(DeviceDetailsProviderContext);
  if (context === undefined)
    throw new Error(
      "useDeviceDetails must be used within a DeviceDetailsProvider"
    );
  return context.deviceDetails;
};
