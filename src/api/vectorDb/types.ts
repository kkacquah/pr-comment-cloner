import { ContentType } from "../../models/enums/ContentType";

export const VectorDbCollections = {
  // Create a collection for each content type
  ...ContentType,
};

export type VectorDbCollection = keyof typeof VectorDbCollections;

export type QueryOptionsBase = {
  collectionName: VectorDbCollection;
  limit: number;
};

export type TextQueryOptions = QueryOptionsBase & {
  query: string[];
};

export type VectorQueryOptions = QueryOptionsBase & {
  query: number[][];
};

export type QueryOptions = TextQueryOptions | VectorQueryOptions;
