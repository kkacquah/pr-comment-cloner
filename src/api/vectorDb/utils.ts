import { Embedding as ChromaEmbedding, GetResponse } from "chromadb";

export const createEmbeddingFromDocument = (
  document: string,
  ids: string[],
  embeddings: ChromaEmbedding[],
  index: number
) => {
  return {
    contentId: parseInt(ids[index]),
    text: document,
    vector: embeddings[index],
  };
};

export const createEmbeddingsFromDocuments = (
  getResponse: Pick<GetResponse, "documents" | "ids">
) => {
  const documents = getResponse.documents;
  const ids = getResponse.ids;
  const embeddings: ChromaEmbedding[] = [];
  if (!documents || !ids) {
    return [];
  }
  return documents
    .filter((document): document is string => document !== null)
    .map((document, index) =>
      createEmbeddingFromDocument(document, ids, embeddings, index)
    );
};
