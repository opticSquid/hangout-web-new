import { useState, type ReactElement } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { PasswordInputProps } from "@/lib/types/props/password-input-props";
import { EyeIcon, EyeOffIcon } from "lucide-react";

function PasswordInputComponent(props: PasswordInputProps): ReactElement {
  const [passwordMode, setPasswordMode] = useState<"password" | "text">(
    "password"
  );
  const toggleIsPasswordVisible = () => {
    setPasswordMode((prevState) =>
      prevState === "password" ? "text" : "password"
    );
  };
  return (
    <div className="relative">
      <Input
        id={props.name}
        name={props.name}
        type={passwordMode}
        value={props.value}
        onChange={props.handleChange}
        className="pr-10"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggleIsPasswordVisible}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-0 h-auto text-muted-foreground"
        tabIndex={-1}
      >
        {passwordMode === "password" ? (
          <EyeIcon className="size-4" />
        ) : (
          <EyeOffIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}
export default PasswordInputComponent;
