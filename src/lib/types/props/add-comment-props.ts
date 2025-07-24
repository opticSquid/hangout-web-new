import type { Comment } from "../comment";

export interface AddCommentProps {
  type: "comment" | "reply";
  postId: string;
  appendComment: (comment: Comment) => void;
}
