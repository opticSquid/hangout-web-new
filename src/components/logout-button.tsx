import type { ReactElement } from "react";
import { Button } from "./ui/button";

function LogoutComponent(): ReactElement {
  return (
    <Button variant="destructive" size="sm">
      Logout
    </Button>
  );
}
export default LogoutComponent;
