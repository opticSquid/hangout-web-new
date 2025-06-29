import type { ReactElement } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import type { EmailVerificationAlertProps } from "@/lib/types/props/email-verification-alert-props";
import { useNavigate } from "react-router";

function EmailVerificationAlert(
  props: EmailVerificationAlertProps
): ReactElement {
  const navigate = useNavigate();
  return (
    <AlertDialog open={props.isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Verify your Email</AlertDialogTitle>
          <AlertDialogDescription>
            An email has been sent to your email address. Please click on the
            link to confirm your email.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => navigate("/")}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EmailVerificationAlert;
