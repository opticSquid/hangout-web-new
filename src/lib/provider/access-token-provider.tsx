import { type ReactNode, useState, useEffect } from "react";
import { AccessTokenContext } from "../context/access-token-context";

let _accessToken: string | null = null; // Shared reference
export const AccessTokenProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);

  const setAccessToken = (token: string | null) => {
    _accessToken = token;
    setAccessTokenState(token);
  };

  const getAccessToken = () => _accessToken;

  useEffect(() => {
    _accessToken = accessToken; // Keep in sync
  }, [accessToken]);

  return (
    <AccessTokenContext.Provider
      value={{ accessToken, setAccessToken, getAccessToken }}
    >
      {children}
    </AccessTokenContext.Provider>
  );
};
