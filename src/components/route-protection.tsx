import { useAccessTokenContextHandler } from "@/lib/hooks/useAccessToken";
import { RenewAccessToken } from "@/lib/services/renew-token-service";
import type { RouteProtectionProps } from "@/lib/types/props/route-protection-props";
import { useEffect, useState, type ReactElement } from "react";
import { Navigate } from "react-router";
import LoadingOverlay from "./loading-overlay";

function RouteProtection(props: RouteProtectionProps): ReactElement | null {
  // Can return null during loading
  const accessTokenHandler = useAccessTokenContextHandler();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null means "checking"

  useEffect(() => {
    const checkAuth = async () => {
      if (accessTokenHandler.getAccessToken() === null) {
        try {
          const response = await RenewAccessToken();
          accessTokenHandler.setAccessToken(response);
          setIsAuthenticated(true);
        } catch (error: any) {
          console.error("useAuthGuard: Error renewing access token:", error);
          accessTokenHandler.setAccessToken(null); // Ensure token is cleared on error
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, [accessTokenHandler]); // Add dependencies to useEffect

  // 1. While checking authentication, render nothing or a loading spinner
  if (isAuthenticated === null) {
    return <LoadingOverlay message="loading..." />; // return a loading spinner component: <LoadingSpinner />
  }

  // 2. If not authenticated, redirect to sign-in
  if (isAuthenticated === false) {
    return <Navigate to="/sign-in" replace />;
  }

  // 3. If authenticated, render children
  return props.children;
}

export default RouteProtection;
