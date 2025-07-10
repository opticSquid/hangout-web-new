import { createContext } from "react";
import type { AccessTokenContextType } from "../types/access-token";

export const AccessTokenContext = createContext<
  AccessTokenContextType | undefined
>(undefined);
