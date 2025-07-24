import type { Comment } from "../comment";
export interface CommentProps extends React.HTMLAttributes<HTMLDivElement> {
  comment: Comment;
  postId: string;
  showReplyButton?: boolean;
}
