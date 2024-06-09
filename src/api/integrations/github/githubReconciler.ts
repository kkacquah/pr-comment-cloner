import { PullRequest } from "../../../models/entities/PullRequest";
import {
  GitHubPullRequest,
  GitHubPullRequestPullRequestComment,
} from "./types";
import { PullRequestCommentData } from "../../../models/entities/PullRequestComment";
import { EntityInitializer } from "../../../models/types";

export const GithubReconciler = {
  reconcilePullRequests: (
    githubPullRequests: GitHubPullRequest[]
  ): EntityInitializer<PullRequest>[] => {
    return githubPullRequests.map((pr) => ({
      pullRequestNumber: pr.number,
      createdAt: new Date(pr.created_at),
    }));
  },
  reconcileNonReplyWithDiffHunkPullRequestComments: (
    githubPullRequestComments: GitHubPullRequestPullRequestComment[]
  ): PullRequestCommentData[] => {
    return githubPullRequestComments
      .filter((prc) => !prc.in_reply_to_id && prc.diff_hunk)
      .map((prc) => ({
        externalCommentId: prc.id.toString(),
        pullRequestNumber: prc.id,
        body: prc.body,
        authorLogin: prc.user.login,
        diffHunk: prc.diff_hunk,
        createdAt: new Date(prc.created_at),
        raw: prc,
      }));
  },
};
