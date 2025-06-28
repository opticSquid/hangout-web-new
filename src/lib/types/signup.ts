export type SignupFormSchema = {
  username: string;
  email: string;
  password: string;
};

export type SignupFromErrors = Partial<SignupFormSchema>;

export type SignupRs = {
  message: string;
};
