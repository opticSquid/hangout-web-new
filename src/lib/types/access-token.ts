export type AccessTokenContextType = {
  accessToken: string | null;
} & AccessTokenHandlers;

export type AccessTokenHandlers = {
  getAccessToken: () => string | null;
  setAccessToken: (token: string | null) => void;
};
