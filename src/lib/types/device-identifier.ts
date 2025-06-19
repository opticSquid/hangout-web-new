export type OS = {
  name: string;
  version?: string;
};
export type ScreenDimensions = {
  height: number;
  width: number;
};
export type DeviceInfo = {
  os: OS;
  screen: ScreenDimensions;
};
