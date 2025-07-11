import { useContext } from "react";
import { AccessTokenContext } from "../context/access-token-context";
import type { AccessTokenContextType } from "../types/access-token";

export const useAccessTokenContext = (): AccessTokenContextType => {
  const context = useContext(AccessTokenContext);
  if (!context)
    throw new Error("useAccessToken must be used inside AccessTokenProvider");
  return context;
};
