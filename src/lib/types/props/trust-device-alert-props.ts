import type { AccessTokenObject } from "../access-token";

export interface TrustDeviceAlertProps {
  shouldOpen: boolean;
  onClose: () => void;
  handleTrustResult: (context: AccessTokenObject) => void;
}
