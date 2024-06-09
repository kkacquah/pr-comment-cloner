import dotenv from "dotenv";

// Load the .env file
dotenv.config();

import { AppDataSource } from "../../data-source";
import { contentEmbeddingService } from "../llm/contentEmbedding/contentEmbeddingService";
import { ContentType } from "../../models/enums/ContentType";

const runDisplayNearestDiffHunks = async () => {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question(
    "Please enter the query text for diff hunks: ",
    async (queryText: string) => {
      try {
        const nearestDiffHunks =
          await contentEmbeddingService.getSimilarContent(
            queryText,
            ContentType.diffHunk,
            10
          );
        console.log("Nearest diff hunks:", nearestDiffHunks);
        console.log("Successfully displayed nearest diff hunks!");
      } catch (error) {
        console.error("Error displaying nearest diff hunks:", error);
      }
      readline.close();
    }
  );
};

// Initialize the database
AppDataSource.initialize().then(() => {
  // Run the comment processing
  runDisplayNearestDiffHunks();
});
