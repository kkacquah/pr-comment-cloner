import { contentService } from "./content/contentService";
import { ContentType } from "../../../models/enums/ContentType";
import { Content } from "../../../models/entities/Content";
import { EntityInitializer } from "../../../models/types";
import { embeddingService } from "./embedding/embeddingService";
import { ContentNearestNeighbors } from "../../../models/entities/ContentNearestNeighbors";

export const contentEmbeddingService = {
  saveEmbeddingsAndContent: async (
    contentInitializers: EntityInitializer<Content>[]
  ): Promise<void> => {
    const content = await contentService.saveContent(contentInitializers);
    const embeddingInitializers = content.map((item) => ({
      text: item.text,
      contentId: item.id,
    }));
    await embeddingService.addEmbeddings(
      // TODO: Make this dynamic to add support for different content types.
      ContentType.diffHunk,
      embeddingInitializers
    );
  },
  getSimilarContent: async (
    queryText: string,
    contentType: ContentType,
    limit: number
  ) => {
    const [nearestEmbeddings] =
      await embeddingService.getNearestNeighborsForQuery({
        collectionName: contentType,
        query: [queryText],
        limit,
      });
    const similarContent = await contentService.getContentByIds(
      nearestEmbeddings.map((embedding) => embedding.embedding.contentId)
    );
    return similarContent;
  },
  saveNearestNeighborsForContentRecords: async (limit: number) => {
    const contentToLimit = await contentService.getContentToLimit(limit);
    console.log(`Found ${contentToLimit.length} content records`);
    const embeddingToNeighborsMap =
      await embeddingService.getNearestNeighborsForContentRecords(
        contentToLimit.map((content) => content.id)
      );
    const contentNeighbors: EntityInitializer<ContentNearestNeighbors>[] = [];
    for (const [embedding, neighbors] of embeddingToNeighborsMap) {
      neighbors.forEach((neighbor) => {
        contentNeighbors.push({
          contentId: embedding.contentId,
          neighborContentId: neighbor.embedding.contentId,
          distance: neighbor.distance,
        });
      });
    }
    await contentService.saveContentNeighbors(contentNeighbors);
  },
};
