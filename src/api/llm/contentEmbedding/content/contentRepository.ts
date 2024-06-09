import { AppDataSource } from "../../../../data-source";
import { Content } from "../../../../models/entities/Content";

export const ContentRepository = AppDataSource.getRepository(Content);
