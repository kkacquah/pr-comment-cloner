import { ChromaClient, IncludeEnum, OpenAIEmbeddingFunction } from "chromadb";
import { config } from "../../config/options";
import {
  Embedding,
  EmbeddingInitializer,
  EmbeddingNeighbor,
} from "../../models/entities/Embedding";
import { QueryOptions, VectorDbCollection } from "./types";
import {
  createEmbeddingFromDocument,
  createEmbeddingsFromDocuments,
} from "./utils";
import { isStringArray } from "../../utils";

export class VectorDbService {
  private chromaClient: ChromaClient;
  private embeddingFunction: OpenAIEmbeddingFunction;

  constructor() {
    this.chromaClient = new ChromaClient({
      path: `http://vector_db:${config.vectorDb.port}`,
    });
    this.embeddingFunction = new OpenAIEmbeddingFunction({
      openai_api_key: config.openai.apiKey,
      openai_model: config.openai.embeddingModel,
    });
  }

  private async createCollectionIfNotExists(
    collectionName: VectorDbCollection
  ): Promise<void> {
    const collections = await this.chromaClient.listCollections();
    if (
      !collections.map((collection) => collection.name).includes(collectionName)
    ) {
      await this.chromaClient.createCollection({
        name: collectionName,
        embeddingFunction: this.embeddingFunction,
      });
    }
  }

  private async getOrCreateCollection(collectionName: VectorDbCollection) {
    await this.createCollectionIfNotExists(collectionName);
    const collection = await this.chromaClient.getCollection({
      name: collectionName,
      embeddingFunction: this.embeddingFunction,
    });
    return collection;
  }

  public async addDocuments(
    collectionName: VectorDbCollection,
    initializers: EmbeddingInitializer[]
  ): Promise<void> {
    const collection = await this.getOrCreateCollection(collectionName);
    await collection.add({
      ids: initializers.map((initializer) => initializer.contentId.toString()),
      documents: initializers.map((initializer) => initializer.text),
    });
  }

  public async getEmbeddings(
    collectionName: VectorDbCollection,
    contentIds: number[]
  ): Promise<Embedding[]> {
    const collection = await this.getOrCreateCollection(collectionName);
    const result = await collection.get({
      ids: contentIds.map((id) => id.toString()),
      include: [IncludeEnum.Embeddings, IncludeEnum.Documents],
    });
    console.log(`result`, result);
    return createEmbeddingsFromDocuments(result);
  }

  public async query({
    collectionName,
    query,
    limit,
  }: QueryOptions): Promise<EmbeddingNeighbor[][]> {
    const collection = await this.getOrCreateCollection(collectionName);
    // Supports querying by text or embedding.
    const result = isStringArray(query)
      ? await collection.query({
          queryTexts: query,
          nResults: limit,
          include: [
            IncludeEnum.Embeddings,
            IncludeEnum.Documents,
            IncludeEnum.Distances,
          ],
        })
      : await collection.query({
          queryEmbeddings: query,
          nResults: limit,
          include: [
            IncludeEnum.Embeddings,
            IncludeEnum.Documents,
            IncludeEnum.Distances,
          ],
        });
    const distances = result.distances;
    const embeddings = result.embeddings;
    // Distances and embeddings can be null, for some reason.
    if (!distances || !embeddings) {
      throw new Error("No distances or embeddings found in query result");
    }
    return result.documents.map((documents, documentListIndex) =>
      documents
        .filter((document): document is string => document !== null)
        .map((document, documentIndex) => ({
          embedding: createEmbeddingFromDocument(
            document,
            result.ids[documentListIndex],
            embeddings[documentListIndex],
            documentIndex
          ),
          distance: distances[documentListIndex][documentIndex],
        }))
    );
  }
}
