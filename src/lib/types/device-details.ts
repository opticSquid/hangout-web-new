type OS = {
  name: string;
  version?: string;
};

type ScreenDimensions = {
  height: number;
  width: number;
};

export const osMap: { [key: string]: OS } = {
  windows: { name: "Windows" },
  macos: { name: "macOS" },
  linux: { name: "Linux" },
  android: { name: "Android" },
  ios: { name: "iOS" },
};

export type DeviceDetails = {
  os: OS;
  screen: ScreenDimensions;
};

export type DeviceDetailsState = {
  deviceDetails: DeviceDetails;
  setDeviceDetails: (deviceInfo: DeviceDetails) => void;
};

export const defaultDeviceDetailsState: DeviceDetailsState = {
  deviceDetails: {
    os: {
      name: "",
      version: "",
    },
    screen: {
      height: 0,
      width: 0,
    },
  },
  setDeviceDetails: () => null,
};
