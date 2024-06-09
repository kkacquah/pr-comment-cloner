import { In } from "typeorm";
import { Content } from "../../../../models/entities/Content";
import { ContentRepository } from "./contentRepository";
import { EntityInitializer } from "../../../../models/types";
import { ContentNearestNeighbors } from "../../../../models/entities/ContentNearestNeighbors";
import { ContentNeighborsRepository } from "./contentNeighborsRepository";

export const contentService = {
  saveContent: async (
    content: EntityInitializer<Content>[]
  ): Promise<Content[]> => ContentRepository.save(content),
  getContentByIds: async (contentIds: number[]): Promise<Content[]> =>
    ContentRepository.find({ where: { id: In(contentIds) } }),
  saveContentNeighbors: async (
    contentNeighbors: EntityInitializer<ContentNearestNeighbors>[]
  ): Promise<ContentNearestNeighbors[]> =>
    ContentNeighborsRepository.save(contentNeighbors),
  getContentToLimit: async (limit: number): Promise<Content[]> =>
    ContentRepository.find({ take: limit }),
};
