import { useContext } from "react";
import { AccessTokenContext } from "../context/access-token-context";
import type {
  AccessTokenHandlers,
  AccessTokenObject,
} from "../types/access-token";

export const useAccessTokenContextHandler = (): AccessTokenHandlers => {
  const context = useContext(AccessTokenContext);
  if (!context)
    throw new Error(
      "useAccessTokenContextHandler must be used inside AccessTokenProvider"
    );
  return {
    getAccessToken: context.getAccessToken,
    setAccessToken: context.setAccessToken,
    isTrustedDevice: context.isTrustedDevice,
    setTrustedDevice: context.setTrustedDevice,
  };
};

export const useAccessTokenContextObject = (): Readonly<AccessTokenObject> => {
  const context = useContext(AccessTokenContext);
  if (!context)
    throw new Error(
      "useAccessTokenContextObject must be used inside AccessTokenProvider"
    );
  return {
    accessToken: context.accessToken,
    trustedDevice: context.trustedDevice,
  };
};
