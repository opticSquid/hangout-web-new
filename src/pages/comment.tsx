import AddCommentComponent from "@/components/add-comment";
import CommentComponent from "@/components/comment";
import ErrorComponent from "@/components/error";
import VideoPlayer from "@/components/video-player";
import { FetchAllTopLevelComments } from "@/lib/services/comment-service";
import { FetchPostById } from "@/lib/services/fetch-posts";
import type { Comment } from "@/lib/types/comment";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import type { Post } from "@/lib/types/post";
import { useEffect, useState, type ReactElement } from "react";
import { useParams } from "react-router";

function CommentPage(): ReactElement {
  const postId = useParams<{ postId: string }>().postId;
  const [postDetails, setPostDetails] = useState<Post>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [apiError, setApiError] = useState<ProblemDetail>();
  useEffect(() => {
    if (postId !== undefined) {
      const fetchPost = async () => {
        try {
          const post = await FetchPostById(postId);
          setPostDetails(post);
        } catch (error: any) {
          error = error as ProblemDetail;
          setApiError(error);
        }
      };
      const fetchComments = async () => {
        try {
          const comments = await FetchAllTopLevelComments(postId);
          console.log("comments", comments);
          // Sort comments by createdAt in descending order
          comments.sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
          setComments(comments);
        } catch (error: any) {
          error = error as ProblemDetail;
          setApiError(error);
        }
      };
      Promise.all([fetchPost(), fetchComments()]);
    }
  }, [postId]);
  const appendComment = (comment: Comment) => {
    setComments((prevComments) => [comment, ...prevComments]);
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
          showInteractions={false}
          postInteractions={{
            hearts: postDetails.hearts,
            comments: postDetails.comments,
            distance: postDetails.distance,
            interactions: postDetails.interactions,
            location: postDetails.location,
          }}
        />
        <div className="h-2/5 overflow-y-scroll">
          {postId && (
            <AddCommentComponent
              type="comment"
              postId={postId}
              appendComment={appendComment}
            />
          )}
          {comments.map((comment) => {
            if (postId !== undefined) {
              return (
                <CommentComponent
                  comment={comment}
                  postId={postId}
                  key={comment.commentId}
                />
              );
            }
          })}
        </div>
      </div>
      {apiError && <ErrorComponent error={apiError} setError={setApiError} />}
    </>
  ) : (
    <div>no post</div>
  );
}

export default CommentPage;
