import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DeliberateRenewAccessToken } from "../services/renew-token-service";
import {
  useAccessTokenContextHandler,
  useAccessTokenContextObject,
} from "./useAccessToken";
import { useDeviceDetails } from "./useDeviceDetails";

export const useAuthGuard = (): boolean => {
  const accessTokenObject = useAccessTokenContextObject();
  const accessTokenHandler = useAccessTokenContextHandler();
  const deviceDetails = useDeviceDetails();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    accessTokenObject.accessToken !== null
  );

  useEffect(() => {
    const func = async () => {
      if (isAuthenticated === false) {
        try {
          console.log("useAuthGuard: Checking authentication status...");

          console.log(
            "useAuthGuard: No access token found, trying to renew..."
          );
          const response = await DeliberateRenewAccessToken(deviceDetails);
          console.log("useAuthGuard: Access token renewed successfully.");
          accessTokenHandler.setAccessToken(response);
          setIsAuthenticated(true);
        } catch (error: any) {
          console.error("useAuthGuard: Error renewing access token:", error);
          accessTokenHandler.setAccessToken(null);
          navigate("/sign-in", { replace: true });
          setIsAuthenticated(false);
        }
      } else {
        console.log("access token is not null");
      }
    };
    func();
  }, [accessTokenObject.accessToken]);

  return isAuthenticated;
};
