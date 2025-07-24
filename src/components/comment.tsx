import type { CommentProps } from "@/lib/types/props/comment-props";
import { getTimeDifferenceFromUTC } from "@/lib/utils/time-difference";
import { DotIcon, MessageSquareReplyIcon } from "lucide-react";
import type { ReactElement } from "react";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils/utils";

function CommentComponent(props: CommentProps): ReactElement {
  return (
    <>
      <div
        className={cn(
          "m-1 flex flex-row items-start gap-2 pl-2 pr-2",
          props.className
        )}
      >
        <Avatar className="size-10">
          <AvatarImage src="/images/small.jpg" className="object-cover" />
          <AvatarFallback>TI</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex flex-row items-center text-base font-semibold tracking-tighter">
            <div>Commenter Name</div>
            <DotIcon size={16} />
            <div className="text-neutral-500">
              {getTimeDifferenceFromUTC(props.comment.createdAt)}
            </div>
          </div>
          <div className="text-lg">{props.comment.text}</div>
          {props.showReplyButton && (
            <div className="flex flex-row items-center">
              <Link
                to={`/post/${props.postId}/comments/reply/${props.comment.commentId}`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 dark:text-gray-300 pl-1"
                >
                  <MessageSquareReplyIcon size={18} />
                  &nbsp;reply
                </Button>
              </Link>
              {props.comment.replyCount > 0 && (
                <div className="text-primary font-bold">
                  {props.comment.replyCount}&nbsp;
                  {props.comment.replyCount > 1 ? "replies" : "reply"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <hr className="ml-2 mr-2 bg-gray-400 dark:bg-slate-800" />
    </>
  );
}

export default CommentComponent;
