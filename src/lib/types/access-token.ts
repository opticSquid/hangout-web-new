export type AccessTokenContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  getAccessToken: () => string | null; // To use in Axios
};
