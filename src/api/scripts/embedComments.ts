import dotenv from "dotenv";

// Load the .env file
dotenv.config();

import { AppDataSource } from "../../data-source";
import { commentEmbeddingService } from "../commentEmbedding/commentEmbeddingService";

const runCommentEmbedding = async () => {
  try {
    console.log("Emedding review comments...");
    await commentEmbeddingService.embedPullRequestComments(2000);
    console.log("Successfully processed and saved reviews!");
  } catch (error) {
    console.error("Error processing reviews:", error);
  }
};

// Initialize the database
AppDataSource.initialize().then(() => {
  // Run the comment processing
  runCommentEmbedding();
});
