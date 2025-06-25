import type { ProfileHeaderProps } from "@/lib/types/props/profile-header-props";
import LogoutComponent from "./logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { ReactElement } from "react";

function ProfileHeaderComponent(props: ProfileHeaderProps): ReactElement {
  const getInitials = (fullName: string) => {
    const nameParts = fullName.split(" ");
    return nameParts[0][0] + nameParts[1][0];
  };
  return (
    <div className="flex flex-row items-center justify-start m-4 gap-x-4">
      <Avatar className="size-32">
        <AvatarImage
          src={props.profilePictureBaseUrl}
          srcSet={`
                    ${props.profilePictureBaseUrl}_144.avif 144w,
                    ${props.profilePictureBaseUrl}_360.avif 360w,
                    ${props.profilePictureBaseUrl}_720.avif 720w,
                    ${props.profilePictureBaseUrl} 1080w
                `}
          className="object-cover"
        />
        <AvatarFallback delayMs={500}>{getInitials(props.name)}</AvatarFallback>
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
