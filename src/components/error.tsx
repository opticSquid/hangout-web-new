import type { ErrorComponentProps } from "@/lib/types/props/error-component-props";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import type { ReactElement } from "react";

function ErrorComponent(props: ErrorComponentProps): ReactElement {
  return (
    <AlertDialog
      open={props.error !== undefined}
      onOpenChange={() => props.setError(undefined)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {props.error ? props.error.title : "Error Occurred"}
          </AlertDialogTitle>
          <AlertDialogDescription>{props.error?.detail}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Dismiss</AlertDialogCancel>
          {/* Primary Action you want to pass for correcting the error*/}
          {props.children}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ErrorComponent;
