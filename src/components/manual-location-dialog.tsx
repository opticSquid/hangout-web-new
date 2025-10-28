import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface ManualLocationDialogProps {
  errorMessage: string | null;
  open: boolean;
  onClose: () => void;
  onSetManualLocation: () => void;
}

export default function ManualLocationDialog({
  errorMessage,
  open,
  onClose,
  onSetManualLocation,
}: ManualLocationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Location Error</DialogTitle>
          <DialogDescription>
            <span style={{ color: "#b91c1c" }}>{errorMessage}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onSetManualLocation}>Set Location Manually</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
