import type { ProfileHeaderProps } from "@/lib/types/props/profile-header-props";
import LogoutComponent from "./logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { ReactElement } from "react";
import { GetInitials } from "@/lib/utils/extract-initials";

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
      <div className="flex flex-col gap-y-2">
        <div className="grow text-lg font-medium tracking-wide">
          {props.name}
        </div>
        <LogoutComponent />
      </div>
    </div>
  );
}
export default ProfileHeaderComponent;
