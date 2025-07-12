import type { Dispatch, SetStateAction } from "react";
import type { AccessTokenObject } from "../access-token";

export interface SigninFormProps {
  handleSigninResult: (context: AccessTokenObject) => void;
  setOpenNotTrustedAlert: Dispatch<SetStateAction<boolean>>;
}
