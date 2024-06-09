import { AppDataSource } from "../../../data-source";
import { PullRequestComment } from "../../../models/entities/PullRequestComment";
import { In, Repository } from "typeorm";
import { EntityInitializer } from "../../../models/types";

export class PullRequestCommentsRepository extends Repository<PullRequestComment> {
  // TODO: Can't override save because I can't figure out how to make it return the new entities
  async saveComments(
    comments: EntityInitializer<PullRequestComment>[]
  ): Promise<void> {
    await this.createQueryBuilder()
      .insert()
      .into(PullRequestComment)
      .values(comments)
      .returning(["id"])
      .orIgnore()
      .execute();
  }
}

export const pullRequestCommentsRepository = new PullRequestCommentsRepository(
  PullRequestComment,
  AppDataSource.createEntityManager()
);
