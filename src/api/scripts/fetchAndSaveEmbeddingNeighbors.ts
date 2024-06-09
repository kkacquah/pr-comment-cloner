import dotenv from "dotenv";

// Load the .env file
dotenv.config();

import { AppDataSource } from "../../data-source";
import { contentEmbeddingService } from "../llm/contentEmbedding/contentEmbeddingService";

const fetchAndSaveEmbeddingNeighbors = async () => {
  await contentEmbeddingService.saveNearestNeighborsForContentRecords(10);
};

// Initialize the database
AppDataSource.initialize().then(() => {
  // Run the comment processing
  fetchAndSaveEmbeddingNeighbors();
});
