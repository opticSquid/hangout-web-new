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

function AddCommentComponent(props: AddCommentProps): ReactElement {
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<Profile>();
  const [apiError, setApiError] = useState<ProblemDetail>();
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

  const profilePictureUrl =
    profileData != undefined
      ? `${import.meta.env.VITE_API_BASE_URL}/profile-photos/${
          profileData.profilePicture.filename
        }`
      : undefined;

  async function onSubmit() {
    setIsLoading(true);
    try {
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
      console.error("Error submitting comment:", error);
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
