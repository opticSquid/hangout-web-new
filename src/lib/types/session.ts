export type SessionActions = {
  setAccessToken: (newToken: string | undefined) => void;
  setRefreshToken: (newToken: string | undefined) => void;
  setUserId: (newUserId: number | undefined) => void;
  setTrustedSession: (isTrusted: boolean | undefined) => void;
  isAuthenticated: () => boolean;
  clearAccessToken: () => void;
  reset: () => void;
};

export type SessionState = {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  userId: number | undefined;
  isTrustedSession: boolean | undefined;
};

export type TokenBody = {
  deviceId: string;
  sub: string;
  iat: number;
  exp: number;
};

export type RenewToken = {
  token: string;
};
