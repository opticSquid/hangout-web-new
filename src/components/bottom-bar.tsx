import { BadgePlusIcon, HouseIcon, UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import type { ReactElement } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

function BottomBarComponent(): ReactElement {
  return (
    <div className="z-20 w-screen flex flex-row justify-between items-center px-1 bg-background">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="size-12">
            <HouseIcon className="size-8" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Home</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="size-12">
            <BadgePlusIcon className="size-8" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="size-12">
            <UserIcon className="size-8" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Profile</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
export default BottomBarComponent;
