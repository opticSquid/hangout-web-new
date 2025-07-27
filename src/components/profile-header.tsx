import type { ProfileHeaderProps } from "@/lib/types/props/profile-header-props";
import { GetInitials } from "@/lib/utils/extract-initials";
import type { ReactElement } from "react";
import LogoutComponent from "./logout-button";
import ThemeToggle from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function ProfileHeaderComponent(props: ProfileHeaderProps): ReactElement {
  return (
    <div className="flex flex-row items-center justify-start m-4 gap-x-4">
      <Avatar className="size-32">
        <AvatarImage
          src={props.profilePictureBaseUrl}
          className="object-cover"
        />
        <AvatarFallback delayMs={500}>{GetInitials(props.name)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-y-2 grow">
        <div className="text-lg font-medium tracking-wide overflow-ellipsis">
          {props.name}
        </div>
        <div className="flex flex-row gap-x-2 items-center justify-between">
          <LogoutComponent />
          {/* <Button variant="outline" size="icon">
            <EllipsisIcon />
          </Button> */}
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
export default ProfileHeaderComponent;
