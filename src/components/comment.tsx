import { FetchOtherProfileData } from "@/lib/services/profile-service";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import type { PublicProfile } from "@/lib/types/profile";
import type { CommentProps } from "@/lib/types/props/comment-props";
import { getTimeDifferenceFromUTC } from "@/lib/utils/time-difference";
import { cn } from "@/lib/utils/utils";
import { DotIcon, MessageSquareReplyIcon } from "lucide-react";
import { useEffect, useState, type ReactElement } from "react";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { GetInitials } from "@/lib/utils/extract-initials";
import ErrorComponent from "./error";

function CommentComponent(props: CommentProps): ReactElement {
  const [apiError, setApiError] = useState<ProblemDetail>();
  const [profileData, setProfileData] = useState<PublicProfile>();
  useEffect(() => {
    const func = async () => {
      try {
        const response = await FetchOtherProfileData(props.comment.userId);
        setProfileData(response);
      } catch (error: any) {
        const err = error as ProblemDetail;
        setApiError(err);
      }
    };
    func();
  }, []);

  const profilePictureUrl =
    profileData != undefined
      ? `${import.meta.env.VITE_API_BASE_URL}/profile-photos/${
          profileData.profilePicture
        }`
      : undefined;

  return (
    <>
      <div
        className={cn(
          "m-1 flex flex-row items-start gap-2 pl-2 pr-2",
          props.className
        )}
      >
        <Avatar className="size-10">
          <AvatarImage src={profilePictureUrl} className="object-cover" />
          <AvatarFallback>{GetInitials(profileData?.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex flex-row items-center text-base font-semibold tracking-tighter">
            <div>{profileData?.name}</div>
            <DotIcon size={16} />
            <div className="text-neutral-500">
              {getTimeDifferenceFromUTC(props.comment.createdAt)}
            </div>
          </div>
          <div className="text-lg">{props.comment.text}</div>
          {props.showReplyButton && (
            <Link
              to={`/post/${props.postId}/comments/reply/${props.comment.commentId}`}
            >
              <div className="flex flex-row items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 dark:text-gray-300 pl-1"
                >
                  <MessageSquareReplyIcon size={18} />
                  &nbsp;reply
                </Button>
                {props.comment.replyCount > 0 && (
                  <div className="text-primary font-bold">
                    {props.comment.replyCount}&nbsp;
                    {props.comment.replyCount > 1 ? "replies" : "reply"}
                  </div>
                )}
              </div>
            </Link>
          )}
        </div>
      </div>
      <hr className="ml-2 mr-2 bg-gray-400 dark:bg-slate-800" />
      {apiError && <ErrorComponent error={apiError} setError={setApiError} />}
    </>
  );
}

export default CommentComponent;
