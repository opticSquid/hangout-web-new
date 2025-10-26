import AddCommentComponent from "@/components/add-comment";
import CommentComponent from "@/components/comment";
import ErrorComponent from "@/components/error";
import NoPostsNearby from "@/components/no-posts-nearby";
import PostComponent from "@/components/post";
import { useAccessTokenContextObject } from "@/lib/hooks/useAccessToken";
import { FetchAllTopLevelComments } from "@/lib/services/comment-service";
import { FetchPostById } from "@/lib/services/post-service";
import type { Comment } from "@/lib/types/comment";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import type { Post } from "@/lib/types/post";
import { useEffect, useState, type ReactElement } from "react";
import { useParams } from "react-router";

function CommentPage(): ReactElement {
  const postId = useParams<{ postId: string }>().postId;
  const accessTokenObject = useAccessTokenContextObject();
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
          const prblm = error as ProblemDetail;
          setApiError(prblm);
        }
      };
      const fetchComments = async () => {
        try {
          const comments = await FetchAllTopLevelComments(postId);
          // Sort comments by createdAt in descending order
          comments.sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
          setComments(comments);
        } catch (error: any) {
          const prblm = error as ProblemDetail;
          setApiError(prblm);
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
      <PostComponent
        post={postDetails}
        canPlayVideo={true}
        showDistance={false}
        twHeightClassName="h-3/5"
      />
      <div className="h-2/5 flex flex-col">
        <div className="overflow-y-scroll grow">
          {comments.map((comment) => {
            if (postId !== undefined) {
              return (
                <CommentComponent
                  comment={comment}
                  postId={postId}
                  showReplyButton={true}
                  key={comment.commentId}
                />
              );
            }
          })}
        </div>
        {postId && accessTokenObject.accessToken !== null && (
          <AddCommentComponent
            type="comment"
            postId={postId}
            appendComment={appendComment}
          />
        )}
      </div>
      {apiError && <ErrorComponent error={apiError} setError={setApiError} />}
    </>
  ) : (
    <NoPostsNearby />
  );
}

export default CommentPage;
