import type { Comment } from "../comment";

export interface AddCommentProps {
  type: "comment" | "reply";
  postId: string;
  parentCommentId?: string;
  appendComment: (comment: Comment) => void;
}
