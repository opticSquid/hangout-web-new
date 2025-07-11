import { useAccessTokenContext } from "@/lib/hooks/useAccessToken";
import { useState, type ReactElement } from "react";
import { useNavigate } from "react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import { Trust } from "@/lib/services/trust-service";
import LoadingOverlay from "./loading-overlay";
import { useDeviceDetails } from "@/lib/hooks/useDeviceDetails";

export function TrustDeviceAlertComponent(): ReactElement {
  const deviceDetails = useDeviceDetails();
  const accessTokenContext = useAccessTokenContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<ProblemDetail>();
  const trustDevice = async () => {
    try {
      setIsLoading(true);
      const response = await Trust(deviceDetails);
      accessTokenContext.setAccessToken(response.accessToken);
      response.isTrustedDevice !== undefined &&
        accessTokenContext.setTrustedDevice(response.isTrustedDevice);
      navigate("/");
    } catch (error: any) {
      const problem = error as ProblemDetail;
      setApiError(problem);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <AlertDialog open={accessTokenContext.isTrustedDevice()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>New Device Login Detected</AlertDialogTitle>
            <AlertDialogDescription>
              You are logging in through this device for the first time. Do you
              trust this device? If yes click on <strong>Trust session</strong>
              button and all capabilities of the platform will be unloked or if
              you click on <strong>Continue</strong> butoon you will be logged
              in but only some capabilities of the platform will be available
              and you will automatically be logged out within 10 mins
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => navigate("/")}>
              Continue
            </AlertDialogCancel>
            <AlertDialogAction onClick={trustDevice}>
              Trust session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {isLoading && (
        <LoadingOverlay message="trying to unlock the full experience" />
      )}
    </>
  );
}
