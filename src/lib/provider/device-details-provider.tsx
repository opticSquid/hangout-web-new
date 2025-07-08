import { useState, useEffect } from "react";
import { DeviceDetailsProviderContext } from "../context/device-details-context";
import {
  defaultDeviceDetailsState,
  osMap,
  type DeviceDetails,
  type DeviceDetailsState,
} from "../types/device-details";
import type { DeviceDetailsProps } from "../types/props/device-details-props";

export function DeviceDetailsProvider({
  children,
  defaultDeviceDetails = defaultDeviceDetailsState.deviceDetails,
}: DeviceDetailsProps) {
  const [deviceDetails, setDeviceDetails] =
    useState<DeviceDetails>(defaultDeviceDetails);

  useEffect(() => {
    function handleResize() {
      const deviceSpecs: DeviceDetails = deviceDetails;
      if (typeof screen.width === "number") {
        deviceSpecs.screen.width = screen.width;
      }
      if (typeof screen.height === "number") {
        deviceSpecs.screen.height = screen.height;
      }
      let found: boolean = false;
      for (const [key, value] of Object.entries(osMap)) {
        if (window.navigator.userAgent.toLowerCase().includes(key)) {
          deviceSpecs.os = value;
          found = true;
          break;
        }
      }
      if (!found) {
        deviceSpecs.os = { name: "unknown" };
      }
      setDeviceDetails(deviceSpecs);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const value: DeviceDetailsState = {
    deviceDetails: deviceDetails,
    setDeviceDetails: (deviceDetails: DeviceDetails) => {
      setDeviceDetails(deviceDetails);
    },
  };

  return (
    <DeviceDetailsProviderContext.Provider value={value}>
      {children}
    </DeviceDetailsProviderContext.Provider>
  );
}
