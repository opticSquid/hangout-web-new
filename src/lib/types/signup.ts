export type SignupFormSchema = {
  username: string;
  email: string;
  password: string;
  reenteredPassword: string;
};

export type SignupFormErrors = Partial<SignupFormSchema>;

export type SignupRs = {
  message: string;
};
