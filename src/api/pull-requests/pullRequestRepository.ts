import { AppDataSource } from "../../data-source";
import { PullRequest } from "../../models/entities/PullRequest";
import { In, Repository } from "typeorm";
import { EntityInitializer } from "../../models/types";

export class PullRequestsRepository extends Repository<PullRequest> {
  async save(prs: EntityInitializer<PullRequest>[]): Promise<PullRequest[]> {
    await this.createQueryBuilder()
      .insert()
      .into(PullRequest)
      .values(prs)
      .returning(["id"])
      .orIgnore()
      .execute();
    // TODO: This is a hack to get the ids of the inserted pull requests
    const pullRequestNumbers = prs.map((pr) => pr.pullRequestNumber);
    return this.find({
      where: {
        pullRequestNumber: In(pullRequestNumbers),
      },
    });
  }
}

export const pullRequestsRepository = new PullRequestsRepository(
  PullRequest,
  AppDataSource.createEntityManager()
);
