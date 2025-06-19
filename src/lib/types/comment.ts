export type NewComment = {
  type: "comment" | "reply";
  postId: string;
  revalidateCommentAction: () => void;
  parentCommentId?: string;
};
export type NewCommentRq = {
  postId: string;
  parentCommentId?: string;
  comment: string;
};
export type NewCommentRs = {
  message: string;
  commentId: string;
};

export type Comment = {
  commentId: string;
  createdAt: string;
  text: string;
  userId: number;
  replyCount: number;
};
