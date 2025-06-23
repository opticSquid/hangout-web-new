import LogoutComponent from "@/components/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/types/profile";
import { Grid3X3Icon } from "lucide-react";
import type { ReactElement } from "react";

function ProfilePage(): ReactElement {
  const profileData: Profile = {
    profileId: "neobnebn",
    userId: "jinvjbn",
    name: "Soumalya Bhattacharya",
    profilePicture: {
      filename:
        "418d2883f1532dc2f2681aa7788f495338f60c81543c214b1fae0336a47fb76bd71dd7f07541ef0e49e918d126dd0a31bae052ec5e60d39f0fb4e216f205add3_1080.avif",
      contentType: "image/avif",
    },
  };
  const extractedFilename = (filename: string): string => {
    const res = filename.match(/^[^_]*/);
    if (res && res[0] !== undefined) {
      return res[0];
    }
    return "";
  };

  const baseUrl = `http://localhost:9000/processed/${extractedFilename(
    profileData.profilePicture.filename
  )}`;
  const getInitials = (fullName: string) => {
    const nameParts = fullName.split(" ");
    return nameParts[0][0] + nameParts[1][0];
  };
  return (
    <div className="fixed top-0 w-full">
      <div className="flex flex-row items-center justify-start m-4 gap-x-4">
        <Avatar className="size-32">
          <AvatarImage
            src={`${baseUrl}/${profileData.profilePicture.filename}`}
            srcSet={`
                    ${baseUrl}/${profileData.profilePicture.filename}_144.avif 144w,
                    ${baseUrl}/${profileData.profilePicture.filename}_360.avif 360w,
                    ${baseUrl}/${profileData.profilePicture.filename}_720.avif 720w,
                    ${baseUrl}/${profileData.profilePicture.filename} 1080w
                `}
            className="object-cover"
          />
          <AvatarFallback delayMs={500}>
            {getInitials(profileData.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-y-2">
          <div className="grow text-lg font-medium tracking-wide">
            {profileData.name}
          </div>
          <LogoutComponent />
        </div>
      </div>
      <div className="flex flex-row border-t border-b justify-center">
        <Button variant="ghost" size="icon">
          <Grid3X3Icon />
          &nbsp;POSTS
        </Button>
      </div>
      {/* <PostGrid /> */}
    </div>
  );
}
export default ProfilePage;
