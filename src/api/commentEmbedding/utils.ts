import { Content } from "../../models/entities/Content";
import { PullRequestComment } from "../../models/entities/PullRequestComment";
import { ContentType } from "../../models/enums/ContentType";
import { EntityInitializer } from "../../models/types";

const convertPullRequestCommentToCommentEmbeddingRequest = (
  pullRequestComment: PullRequestComment
): EntityInitializer<Content> => ({
  pullRequestCommentId: pullRequestComment.id,
  type: ContentType.comment,
  text: pullRequestComment.body,
});

const convertPullRequestCommentToDiffHunkEmbeddingRequest = (
  pullRequestComment: PullRequestComment
): EntityInitializer<Content> => ({
  pullRequestCommentId: pullRequestComment.id,
  type: ContentType.diffHunk,
  text: pullRequestComment.diffHunk,
});

// For now, we're only embedding diff hunks.
export const getContentFromPullRequestComments = (
  pullRequestComments: PullRequestComment[]
): EntityInitializer<Content>[] => {
  return [
    ...pullRequestComments.map(
      convertPullRequestCommentToDiffHunkEmbeddingRequest
    ),
  ];
};
