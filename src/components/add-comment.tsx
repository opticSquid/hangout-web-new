import type { AddCommentProps } from "@/lib/types/props/add-comment-props";
import { SendHorizonalIcon } from "lucide-react";
import { useState, type ReactElement } from "react";
import LoadingOverlay from "./loading-overlay";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

function AddComment(props: AddCommentProps): ReactElement {
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //   const [profileData, setProfileData] = useState<ProfileData>();
  //   useEffect(() => {
  //     if (sessionState.userId) {
  //       async function fetchProfile() {
  //         const profileResponse: Response = await fetch(
  //           `${process.env.NEXT_PUBLIC_PROFILE_API_URL}/profile/${sessionState.userId}`,
  //           {
  //             headers: new Headers({
  //               "Content-Type": "application/json",
  //             }),
  //           }
  //         );
  //         const profileData: ProfileData = await profileResponse.json();
  //         setProfileData(profileData);
  //       }
  //       fetchProfile();
  //     }
  //   }, [sessionState.userId]);
  // TODO: Implement the onSubmit function to handle comment submission
  async function onSubmit() {}

  return (
    <Card className="p-2 flex flex-row items-center rounded-none">
      <Avatar className="size-10">
        <AvatarImage src="/images/small.jpg" className="object-cover" />
        <AvatarFallback>TI</AvatarFallback>
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
        disabled={isLoading}
      >
        <SendHorizonalIcon className="size-6" />
      </Button>
      {isLoading && <LoadingOverlay message="adding comment..." />}
    </Card>
  );
}

export default AddComment;
