import { PullRequestComment } from "../../models/entities/PullRequestComment";
import { config } from "../../config/options";
import { GithubService } from "../integrations/github/githubService";
import { pullRequestCommentsService } from "./pull-request-comments/pullRequestCommentsService";
import { PullRequest } from "../../models/entities/PullRequest";
import { pullRequestsRepository } from "./pullRequestRepository";
import { pullRequestCommentsRepository } from "./pull-request-comments/pullRequestCommentsRepository";
import { range } from "lodash";
import { pMap } from "../../utils";

const savePullRequest = async (
  pullRequest: PullRequest,
  githubService: GithubService
): Promise<void> => {
  await pullRequestCommentsService.fetchAndSaveForPullRequest(
    pullRequest,
    githubService
  );
};

const fetchAndSaveForPullRequestPage = async (
  githubService: GithubService,
  page: number
): Promise<void> => {
  console.log("Fetching pull request page", page);
  const githubPullRequests = await githubService.fetchPullRequestRecords(page);

  if (!githubPullRequests || githubPullRequests.length === 0) {
    return;
  }
  const backendPullRequests = await pullRequestsRepository.save(
    githubPullRequests
  );
  await Promise.all(
    backendPullRequests.map(async (pr) => savePullRequest(pr, githubService))
  );
};

export const pullRequestService = {
  // Retrieves all users from the database
  fetchAndSaveForPullRequests: async (
    startPage: number,
    numPullRequestPages: number
  ): Promise<void> => {
    const githubService = new GithubService(config.github);
    await pMap(
      range(startPage, numPullRequestPages),
      async (page: number) =>
        fetchAndSaveForPullRequestPage(githubService, page),
      { concurrency: 5 }
    );
  },

  findByCommentsPaginated: async ({
    take,
    skip,
  }: {
    take: number;
    skip: number;
  }): Promise<PullRequestComment[]> => {
    return await pullRequestCommentsRepository.find({
      take,
      skip,
      where: {
        authorLogin: "kkacquah",
      },
    });
  },
};
