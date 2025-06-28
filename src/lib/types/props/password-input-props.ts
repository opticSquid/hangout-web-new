import type { ChangeEvent } from "react";

export interface PasswordInputProps {
  name: string;
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
