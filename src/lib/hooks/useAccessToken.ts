import { useContext } from "react";
import { AccessTokenContext } from "../context/access-token-context";

export const useAccessToken = (): string | null => {
  const context = useContext(AccessTokenContext);
  if (!context)
    throw new Error("useAccessToken must be used inside AccessTokenProvider");
  return context.getAccessToken();
};
