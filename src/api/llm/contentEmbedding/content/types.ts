import { Content } from "../../../../models/entities/Content";
import { ContentType } from "../../../../models/enums/ContentType";

export type EmbedContentRequest = {
  contentRecord: Content;
  body: string;
};

export const DEFAULT_CONTENT_TYPE = ContentType.diffHunk;
