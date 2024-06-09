import { AppDataSource } from "../../../../data-source";
import { ContentNearestNeighbors } from "../../../../models/entities/ContentNearestNeighbors";

export const ContentNeighborsRepository = AppDataSource.getRepository(
  ContentNearestNeighbors
);
