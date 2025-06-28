export type LoginFormSchema = {
  username: string;
  password: string;
};

export type LoginFormErrors = Partial<LoginFormSchema>;

export type Session = {
  accessToken: string;
  refreshToken: string;
  userId: number;
  message: string;
};
