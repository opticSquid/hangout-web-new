export type AccessTokenContextType = {
  accessToken: string | null;
  trustedDevice: boolean;
} & AccessTokenHandlers;

export type AccessTokenHandlers = {
  getAccessToken: () => string | null;
  setAccessToken: (token: string | null) => void;
  isTrustedDevice: () => boolean;
  setTrustedDevice: (trustedDevice: boolean) => void;
};
