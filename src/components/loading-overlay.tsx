import type { LoadingOverlayProps } from "../lib/types/props/loading-overlay-props";
import { cn } from "@/lib/utils/utils";
import { Loader2Icon } from "lucide-react";
import type { ReactElement } from "react";

function LoadingOverlay(props: LoadingOverlayProps): ReactElement {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
        props.className
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <Loader2Icon className="h-10 w-10 animate-spin text-primary" />
        <p className="text-primary text-sm font-medium">{props.message}</p>
      </div>
    </div>
  );
}

export default LoadingOverlay;
