import { HouseIcon } from "lucide-react";
import { Button } from "./ui/button";

function BottomBar() {
  return (
    <div className="border border-black flex">
      <Button variant="secondary" size="icon" className="size-8">
        <HouseIcon />
      </Button>
    </div>
  );
}
export default BottomBar;
