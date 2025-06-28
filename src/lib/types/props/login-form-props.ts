import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { LoginFormErrors, LoginFormSchema } from "../login";

export interface LoginFormProps {
  errors: LoginFormErrors;
  setErrors: Dispatch<SetStateAction<Partial<LoginFormSchema>>>;
  handleSubmit(e: FormEvent): Promise<void>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}
