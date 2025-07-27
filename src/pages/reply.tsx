import AddCommentComponent from "@/components/add-comment";
import CommentComponent from "@/components/comment";
import ErrorComponent from "@/components/error";
import VideoPlayer from "@/components/video-player";
import {
  FetchAllReplies,
  FetchCommentById,
} from "@/lib/services/comment-service";
import { FetchPostById } from "@/lib/services/post-service";
import type { Comment } from "@/lib/types/comment";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import type { Post } from "@/lib/types/post";
import { useEffect, useState, type ReactElement } from "react";
import { useParams } from "react-router";

function ReplyPage(): ReactElement {
  const { postId, commentId } = useParams<{
    postId: string;
    commentId: string;
  }>();
  const [postDetails, setPostDetails] = useState<Post>();
  const [commentDetails, setCommentDetails] = useState<Comment>();
  const [replies, setReplies] = useState<Comment[]>([]);
  const [apiError, setApiError] = useState<ProblemDetail>();

  useEffect(() => {
    if (postId !== undefined && commentId !== undefined) {
      const fetchPost = async () => {
        try {
          const post = await FetchPostById(postId);
          setPostDetails(post);
        } catch (error: any) {
          error = error as ProblemDetail;
          setApiError(error);
        }
      };
      const fetchComment = async () => {
        try {
          const comment = await FetchCommentById(commentId);
          setCommentDetails(comment);
        } catch (error: any) {
          error = error as ProblemDetail;
          setApiError(error);
        }
      };
      const fetchReplies = async () => {
        try {
          const replies = await FetchAllReplies(commentId);
          // Sort comments by createdAt in descending order
          replies.sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
          setReplies(replies);
        } catch (error: any) {
          error = error as ProblemDetail;
          setApiError(error);
        }
      };
      Promise.all([fetchPost(), fetchComment(), fetchReplies()]);
    }
  }, [postId, commentId]);
  const appendReply = (reply: Comment) => {
    setReplies((prevReplies) => [reply, ...prevReplies]);
  };
  return postDetails !== undefined ? (
    <>
      <div
        className="snap-start snap-always h-3/5 post-container"
        post-id={postDetails.postId}
      >
        <VideoPlayer
          postId={postDetails.postId}
          filename={postDetails.filename}
          hostURL={`${import.meta.env.VITE_API_BASE_URL}/processed`}
          autoPlay={true}
          showDistance={false}
          postInteractions={{
            hearts: postDetails.hearts,
            comments: postDetails.comments,
            distance: postDetails.distance,
            interactions: postDetails.interactions,
            location: postDetails.location,
          }}
        />
      </div>
      <div className="h-2/5 flex flex-col">
        {postId && commentId && commentDetails && (
          <CommentComponent
            comment={commentDetails}
            postId={postId}
            // className="bg-secondary rounded-b-sm"
          />
        )}
        <div className="ml-4 overflow-y-scroll grow">
          {replies.map((reply) => {
            if (postId !== undefined) {
              return (
                <CommentComponent
                  comment={reply}
                  postId={postId}
                  key={reply.commentId}
                  showReplyButton={true}
                />
              );
            }
          })}
        </div>
        {postId && commentId && (
          <AddCommentComponent
            type="reply"
            postId={postId}
            parentCommentId={commentId}
            appendComment={appendReply}
          />
        )}
      </div>
      {apiError && <ErrorComponent error={apiError} setError={setApiError} />}
    </>
  ) : (
    <div>no post</div>
  );
}
export default ReplyPage;
