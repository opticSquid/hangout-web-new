import { AddComment, AddReply } from "@/lib/services/comment-service";
import { FetchOwnProfileData } from "@/lib/services/profile-service";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import type { Profile } from "@/lib/types/profile";
import type { AddCommentProps } from "@/lib/types/props/add-comment-props";
import { GetInitials } from "@/lib/utils/extract-initials";
import { SendHorizonalIcon } from "lucide-react";
import { useEffect, useState, type ReactElement } from "react";
import ErrorComponent from "./error";
import LoadingOverlay from "./loading-overlay";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { FetchProfilePictureUrl } from "@/lib/services/content-delivery-service";

function AddCommentComponent(props: AddCommentProps): ReactElement {
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<Profile>();
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>();
  const [apiError, setApiError] = useState<ProblemDetail>();
  /**
   * Fetches the user's profile data when the component mounts.
   */
  useEffect(() => {
    const func = async () => {
      try {
        const response = await FetchOwnProfileData();
        setProfileData(response);
      } catch (error: any) {
        const err = error as ProblemDetail;
        setApiError(err);
      }
    };
    func();
  }, []);

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

  async function onSubmit() {
    try {
      setIsLoading(true);
      if (props.type === "comment") {
        const response = await AddComment({
          postId: props.postId,
          comment: comment,
        });
        props.appendComment({
          commentId: response.commentId,
          createdAt: new Date().toUTCString(),
          text: comment,
          userId: 2,
          replyCount: 0,
        });
      } else {
        const response = await AddReply({
          postId: props.postId,
          parentCommentId: props.parentCommentId,
          comment: comment,
        });
        props.appendComment({
          commentId: response.commentId,
          createdAt: new Date().toUTCString(),
          text: comment,
          userId: 2,
          replyCount: 0,
        });
      }
    } catch (error) {
      const err = error as ProblemDetail;
      setApiError(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="p-2 flex flex-row items-center rounded-none">
      <Avatar className="size-10">
        <AvatarImage src={profilePictureUrl} className="object-cover" />
        <AvatarFallback>{GetInitials(profileData?.name)}</AvatarFallback>
      </Avatar>
      <Input
        type="text"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder={
          props.type === "comment" ? "Add a comment..." : "Add a reply ..."
        }
        className="grow"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={onSubmit}
        disabled={isLoading == true}
      >
        <SendHorizonalIcon className="size-6" />
      </Button>
      {isLoading && <LoadingOverlay message="adding comment..." />}
      {apiError && <ErrorComponent error={apiError} setError={setApiError} />}
    </Card>
  );
}

export default AddCommentComponent;
