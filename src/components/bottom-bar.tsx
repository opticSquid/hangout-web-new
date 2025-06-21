import { BadgePlusIcon, HouseIcon, UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import type { ReactElement } from "react";

function BottomBarComponent(): ReactElement {
  return (
    <div className="flex flex-row justify-between items-center">
      <Button variant="ghost" size="icon" className="size-12">
        <HouseIcon className="size-8" />
      </Button>
      <Button variant="ghost" size="icon" className="size-12">
        <BadgePlusIcon className="size-8" />
      </Button>
      <Button variant="ghost" size="icon" className="size-12">
        <UserIcon className="size-8" />
      </Button>
    </div>
  );
}
export default BottomBarComponent;
