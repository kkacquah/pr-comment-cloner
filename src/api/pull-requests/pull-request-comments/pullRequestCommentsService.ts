import { GithubService } from "../../integrations/github/githubService";
import { PullRequestComment } from "../../../models/entities/PullRequestComment";
import { pullRequestCommentsRepository } from "./pullRequestCommentsRepository";
import { PullRequest } from "../../../models/entities/PullRequest";

export const pullRequestCommentsService = {
  fetchByAuthorLogin: async (
    authorLogin: string
  ): Promise<PullRequestComment[]> => {
    return await pullRequestCommentsRepository.find({
      where: {
        authorLogin,
      },
      take: 100,
      skip: 0,
    });
  },
  // Saves only comments that have a diffHunk and are not replies
  fetchAndSaveForPullRequest: async (
    pullRequest: PullRequest,
    githubService: GithubService
  ): Promise<void> => {
    const pullRequestComments =
      await githubService.fetchNonReplyWithDiffHunkPullRequestComments(
        pullRequest.pullRequestNumber
      );
    return await pullRequestCommentsRepository.saveComments(
      pullRequestComments.map((c) => ({
        ...c,
        pullRequestId: pullRequest.id,
      }))
    );
  },
};
