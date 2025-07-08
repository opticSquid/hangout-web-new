import { createContext } from "react";
import { initialState, type ThemeProviderState } from "../types/theme";

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);
