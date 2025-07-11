export type LoginResponse = {
  message: string;
  accessToken: string;
  isTrustedDevice?: boolean; // this is not part of original response just a reference to carry the data from servie layer to component to set context
};
