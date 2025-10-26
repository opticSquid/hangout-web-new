import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAccessTokenContextObject } from "@/lib/hooks/useAccessToken";
import { GetInitials } from "@/lib/utils/extract-initials";
import { BadgePlusIcon, HouseIcon, UserIcon } from "lucide-react";
import { useEffect, useState, type ReactElement } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DoesProfileExist,
  FetchOwnProfileData,
} from "@/lib/services/profile-service";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import type { Profile } from "@/lib/types/profile";
import { FetchProfilePictureUrl } from "@/lib/services/content-delivery-service";
import ErrorComponent from "./error";

function BottomBarComponent(): ReactElement {
  const navigation = useLocation();
  const navigate = useNavigate();
  const { accessToken, trustedDevice } = useAccessTokenContextObject();
  const [profileData, setProfileData] = useState<Profile>();
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>();
  const [apiError, setApiError] = useState<ProblemDetail>();
  /**
   * Fetches the user's profile data when the component mounts. and the user is authenticated.
   */
  useEffect(() => {
    if (accessToken !== null) {
      const func = async () => {
        if (trustedDevice === true) {
          try {
            if (await DoesProfileExist()) {
              const response = await FetchOwnProfileData();
              setProfileData(response);
            } else {
              navigate("/new-profile", { replace: true });
            }
          } catch (error: any) {
            const err = error as ProblemDetail;
            setApiError(err);
          }
        }
      };
      func();
    }
  }, [accessToken, trustedDevice]);

  /**
   * Fetches the user's profile picture URL when the profile data is available.
   */
  useEffect(() => {
    if (profileData?.profilePicture) {
      const fetchProfilePicture = async () => {
        try {
          const response = await FetchProfilePictureUrl(
            profileData.profilePicture.filename
          );
          setProfilePictureUrl(response.url);
        } catch (error) {
          const prblm = error as ProblemDetail;
          setApiError(prblm);
        }
      };
      fetchProfilePicture();
    }
  }, [profileData?.profilePicture]);

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
                {accessToken === null ? (
                  <UserIcon className="size-8" />
                ) : (
                  <Avatar className="size-10">
                    <AvatarImage
                      src={profilePictureUrl}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {GetInitials(profileData?.name)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="size-12">
                {accessToken === null ? (
                  <UserIcon className="size-8" />
                ) : (
                  <Avatar className="size-10">
                    <AvatarImage
                      src={profilePictureUrl}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {GetInitials(profileData?.name)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>Profile</p>
          </TooltipContent>
        </Tooltip>
      </Link>
      {apiError && <ErrorComponent error={apiError} setError={setApiError} />}
    </div>
  );
}
export default BottomBarComponent;
