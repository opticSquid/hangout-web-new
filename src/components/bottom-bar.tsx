import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BadgePlusIcon, HouseIcon, UserIcon } from "lucide-react";
import type { ReactElement } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "./ui/button";

function BottomBarComponent(): ReactElement {
  const navigation = useLocation();
  return (
    <div className="z-20 flex flex-row justify-between items-center px-1 bg-background">
      <Link to="/">
        <Tooltip>
          <TooltipTrigger asChild>
            {navigation.pathname == "/" ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-12 bg-primary rounded-full"
              >
                <HouseIcon className="size-8" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="size-12">
                <HouseIcon className="size-8" />
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>Home</p>
          </TooltipContent>
        </Tooltip>
      </Link>
      <Link to="/create">
        <Tooltip>
          <TooltipTrigger asChild>
            {navigation.pathname === "/create" ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-12 bg-primary rounded-full"
              >
                <BadgePlusIcon className="size-8" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="size-12">
                <BadgePlusIcon className="size-8" />
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>Create</p>
          </TooltipContent>
        </Tooltip>
      </Link>
      <Link to="/profile">
        <Tooltip>
          <TooltipTrigger asChild>
            {navigation.pathname === "/profile" ? (
              <Button
                variant="link"
                size="icon"
                className="size-12 bg-primary rounded-full text-primary-foreground"
              >
                <UserIcon className="size-8" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="size-12">
                <UserIcon className="size-8" />
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>Profile</p>
          </TooltipContent>
        </Tooltip>
      </Link>
    </div>
  );
}
export default BottomBarComponent;
