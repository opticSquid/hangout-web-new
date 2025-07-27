import { useDeviceDetails } from "@/lib/hooks/useDeviceDetails";
import { LogOut } from "@/lib/services/logout-service";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import { useState, type ReactElement } from "react";
import ErrorComponent from "./error";
import LoadingOverlay from "./loading-overlay";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { useAccessTokenContextHandler } from "@/lib/hooks/useAccessToken";

function LogoutComponent(): ReactElement {
  const deviceDetails = useDeviceDetails();
  const accessTokenContextHandler = useAccessTokenContextHandler();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<ProblemDetail>();
  const OnLogout = async () => {
    try {
      setIsLoading(true);
      LogOut(deviceDetails).then(() => {
        accessTokenContextHandler.setAccessToken(null);
        navigate("/");
      });
    } catch (error: any) {
      const err = error as ProblemDetail;
      setApiError(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        className="grow"
        onClick={OnLogout}
        disabled={isLoading}
      >
        Logout
      </Button>
      {isLoading && <LoadingOverlay message="Logging out..." />}
      {apiError && <ErrorComponent error={apiError} setError={setApiError} />}
    </>
  );
}
export default LogoutComponent;
