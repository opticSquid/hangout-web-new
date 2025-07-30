import { useDeviceDetails } from "@/lib/hooks/useDeviceDetails";
import { Trust } from "@/lib/services/trust-service";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import type { AuthResponse } from "@/lib/types/model/auth-response";
import type { TrustDeviceAlertProps } from "@/lib/types/props/trust-device-alert-props";
import { useState, type ReactElement } from "react";
import { useNavigate } from "react-router";
import ErrorComponent from "./error";
import LoadingOverlay from "./loading-overlay";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

function TrustDeviceAlertComponent(props: TrustDeviceAlertProps): ReactElement {
  const deviceDetails = useDeviceDetails();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<ProblemDetail>();
  const trustDevice = async () => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await Trust(deviceDetails);
      props.handleTrustResult({
        accessToken: response.accessToken,
        trustedDevice: response.isTrustedDevice,
      });
    } catch (error: any) {
      const problem = error as ProblemDetail;
      setApiError(problem);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Dialog open={props.shouldOpen} onOpenChange={props.onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Device Login Detected</DialogTitle>
            <DialogDescription>
              You are logging in through this device for the first time. Do you
              trust this device? If yes click on <strong>Trust session</strong>
              button and all capabilities of the platform will be unloked or if
              you click on <strong>Continue</strong> butoon you will be logged
              in but only some capabilities of the platform will be available
              and you will automatically be logged out within 10 mins
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Continue
            </Button>
            <Button onClick={trustDevice}>Trust session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isLoading && (
        <LoadingOverlay message="trying to unlock the full experience" />
      )}
      {apiError && <ErrorComponent error={apiError} setError={setApiError} />}
    </>
  );
}

export default TrustDeviceAlertComponent;
