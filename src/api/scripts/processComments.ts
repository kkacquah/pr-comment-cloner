import dotenv from "dotenv";

// Load the .env file
dotenv.config();

import { AppDataSource } from "../../data-source";
import { pullRequestService } from "../pull-requests/pullRequestService";

const runCommentProcessing = async () => {
  try {
    console.log("Processing reviews...");
    await pullRequestService.fetchAndSaveForPullRequests(110, 140);
    console.log("Successfully processed and saved reviews!");
  } catch (error) {
    console.error("Error processing reviews:", error);
  }
};

// Initialize the database
AppDataSource.initialize().then(() => {
  // Run the comment processing
  runCommentProcessing();
});
