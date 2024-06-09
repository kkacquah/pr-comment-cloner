import { vectorDbService } from "../../../../data-source";
import {
  Embedding,
  EmbeddingInitializer,
  EmbeddingNeighbor,
} from "../../../../models/entities/Embedding";
import { QueryOptions } from "../../../vectorDb/types";
import { ContentType } from "../../types";
import { DEFAULT_CONTENT_TYPE } from "../content/types";

const getNearestNeighborsForQuery = (options: QueryOptions) => {
  return vectorDbService.query(options);
};

export const embeddingService = {
  addEmbeddings: (
    contentType: ContentType,
    initializers: EmbeddingInitializer[]
  ) => {
    return vectorDbService.addDocuments(contentType, initializers);
  },
  getNearestNeighborsForQuery,
  getNearestNeighborsForContentRecords: async (contentIds: number[]) => {
    const embeddings = await vectorDbService.getEmbeddings(
      DEFAULT_CONTENT_TYPE,
      contentIds
    );
    console.log(`Found ${embeddings.length} embeddings`);
    const nearestNeighbors = await getNearestNeighborsForQuery({
      collectionName: DEFAULT_CONTENT_TYPE,
      query: embeddings.map((embedding) => embedding.vector),
      limit: 10,
    });
    const EmbeddingToNeighborsMap = new Map<Embedding, EmbeddingNeighbor[]>();
    embeddings.forEach((embedding, index) => {
      EmbeddingToNeighborsMap.set(embedding, nearestNeighbors[index]);
    });
    return EmbeddingToNeighborsMap;
  },
};
