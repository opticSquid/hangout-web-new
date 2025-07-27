import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DeliberateRenewAccessToken } from "../services/renew-token-service";
import {
  useAccessTokenContextHandler,
  useAccessTokenContextObject,
} from "./useAccessToken";
import { useDeviceDetails } from "./useDeviceDetails";

export const useAuthGuard = (): boolean => {
  const { accessToken } = useAccessTokenContextObject();
  const accessTokenHandler = useAccessTokenContextHandler();
  const deviceDetails = useDeviceDetails();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!accessToken
  );

  useEffect(() => {
    if (accessToken === null) {
      DeliberateRenewAccessToken(deviceDetails)
        .then((token) => {
          accessTokenHandler.setAccessToken(token);
          setIsAuthenticated(true);
        })
        .catch(() => {
          accessTokenHandler.setAccessToken(null);
          navigate("/sign-in", { replace: true });
          setIsAuthenticated(false);
        });
    }
  }, [accessToken, accessTokenHandler, deviceDetails, navigate]);

  return isAuthenticated;
};
