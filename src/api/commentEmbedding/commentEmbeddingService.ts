import { pullRequestService } from "../pull-requests/pullRequestService";
import { config } from "../../config/options";
import { range } from "lodash";
import { getContentFromPullRequestComments } from "./utils";
import { pMap } from "../../utils";
import { contentEmbeddingService } from "../llm/contentEmbedding/contentEmbeddingService";

const embedPullRequestCommentsPerPage = async (
  startIndex: number
): Promise<void> => {
  console.log(
    `Embedding comments from ${startIndex} to ${
      startIndex + config.commentEmbedding.pageBreakSize
    }`
  );
  const pullRequestComments = await pullRequestService.findByCommentsPaginated({
    take: config.commentEmbedding.pageBreakSize,
    skip: startIndex,
  });
  const content = getContentFromPullRequestComments(pullRequestComments);
  await contentEmbeddingService.saveEmbeddingsAndContent(content);
};

export const commentEmbeddingService = {
  embedPullRequestComments: async (numComments: number): Promise<void> => {
    // Get list of offset and limits up to numComments with 100 comments per page
    const pageBreakArray = range(
      0,
      numComments,
      config.commentEmbedding.pageBreakSize
    );
    await pMap(
      pageBreakArray,
      (pageBreak) => embedPullRequestCommentsPerPage(pageBreak),
      { concurrency: config.commentEmbedding.maxConcurrency }
    );
  },
};
