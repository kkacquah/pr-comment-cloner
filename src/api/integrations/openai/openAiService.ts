import OpenAI from "openai";
import { Config } from "src/config/options";

export class OpenAiService {
  private client: OpenAI;
  private config: Config["openai"];

  constructor(config: Config["openai"]) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: this.config.apiKey,
    });
  }

  async fetchEmbeddings(tokens: string[]): Promise<number[]> {
    try {
      const response = await this.client.embeddings.create({
        model: this.config.embeddingModel,
        input: tokens,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error("Failed to fetch embeddings:");
      console.log("Tokens", tokens);
      console.log("Token Count", tokens.length);
      return [];
    }
  }
}
