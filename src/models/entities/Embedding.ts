export interface Embedding {
  contentId: number;
  text: string;
  vector: number[];
}

export type EmbeddingInitializer = Omit<Embedding, "vector">;

export interface EmbeddingNeighbor {
  embedding: Embedding;
  distance: number;
}
