import type { ProfileHeaderProps } from "@/lib/types/props/profile-header-props";
import { GetInitials } from "@/lib/utils/extract-initials";
import { EllipsisIcon } from "lucide-react";
import type { ReactElement } from "react";
import LogoutComponent from "./logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

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
          <Button variant="outline" size="icon">
            <EllipsisIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
export default ProfileHeaderComponent;
