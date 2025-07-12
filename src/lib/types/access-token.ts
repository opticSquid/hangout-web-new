export type AccessTokenObject = {
  accessToken: string | null;
  trustedDevice: boolean;
};

export type AccessTokenHandlers = {
  getAccessToken: () => string | null;
  setAccessToken: (token: string | null) => void;
  isTrustedDevice: () => boolean;
  setTrustedDevice: (trustedDevice: boolean) => void;
};

export type AccessTokenContextType = AccessTokenObject & AccessTokenHandlers;
