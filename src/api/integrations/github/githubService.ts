import axios, { AxiosResponse } from "axios";
import { GithubReconciler } from "./githubReconciler";
import {
  GitHubPullRequest,
  GitHubPullRequestPullRequestComment,
} from "./types";
import { handleAxiosError } from "../../utils/axios";
import { PullRequestCommentData } from "../../../models/entities/PullRequestComment";
import { PullRequest } from "../../../models/entities/PullRequest";
import { EntityInitializer } from "../../../models/types";

// Max number of pull requests per page,
const DEFAULT_PER_PAGE = 100;
// To abide by Github's API rate limit: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28#about-secondary-rate-limits
const DEFAULT_MAX_RATE = 15;

export type GithubServiceConfig = {
  token: string;
  repo: string;
  owner: string;
};

export class GithubService {
  private githubConfig: GithubServiceConfig;
  private axiosInstance;

  constructor(githubConfig: GithubServiceConfig) {
    this.githubConfig = githubConfig;
    this.axiosInstance = axios.create({
      baseURL: "https://api.github.com",
      maxRate: DEFAULT_MAX_RATE,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${this.githubConfig.token}`,
      },
    });

    // Attach a response interceptor to handle errors globally
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      handleAxiosError
    );
  }

  // Function to fetch pull requests from a specific repository
  async fetchPullRequestRecords(
    page: number
  ): Promise<EntityInitializer<PullRequest>[]> {
    const response = await this.axiosInstance
      .get(
        `/repos/${this.githubConfig.owner}/${this.githubConfig.repo}/pulls`,
        {
          params: {
            per_page: DEFAULT_PER_PAGE,
            page,
            state: "all",
          },
        }
      )
      .then((response: AxiosResponse<GitHubPullRequest[]>) =>
        GithubReconciler.reconcilePullRequests(response.data)
      );
    return response;
  }

  // Function to fetch comments from a specific pull request
  async fetchNonReplyWithDiffHunkPullRequestComments(
    pullRequestId: number
  ): Promise<PullRequestCommentData[]> {
    const response = await this.axiosInstance
      .get(
        `/repos/${this.githubConfig.owner}/${this.githubConfig.repo}/pulls/${pullRequestId}/comments`,
        {
          params: {
            per_page: DEFAULT_MAX_RATE,
          },
          headers: { Authorization: `token ${this.githubConfig.token}` },
        }
      )
      .then((response: AxiosResponse<GitHubPullRequestPullRequestComment[]>) =>
        GithubReconciler.reconcileNonReplyWithDiffHunkPullRequestComments(
          response.data
        )
      );
    return response;
  }
}
