import { type ReactNode, useState, useEffect } from "react";
import { AccessTokenContext } from "../context/access-token-context";

let _accessToken: string | null = null; // Shared reference
let _trustedDevice: boolean = false;
export const AccessTokenProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [trustedDevice, setTrustedDeviceState] = useState<boolean>(false);

  const setAccessToken = (token: string | null) => {
    _accessToken = token;
    setAccessTokenState(token);
  };

  const getAccessToken = () => _accessToken;

  const setTrustedDevice = (trustedDevice: boolean) => {
    _trustedDevice = trustedDevice;
    setTrustedDeviceState(trustedDevice);
  };

  const isTrustedDevice = () => _trustedDevice;

  useEffect(() => {
    _accessToken = accessToken; // Keep in sync
    _trustedDevice = trustedDevice;
  }, [accessToken]);

  return (
    <AccessTokenContext.Provider
      value={{
        accessToken,
        trustedDevice,
        setAccessToken,
        getAccessToken,
        isTrustedDevice,
        setTrustedDevice,
      }}
    >
      {children}
    </AccessTokenContext.Provider>
  );
};
