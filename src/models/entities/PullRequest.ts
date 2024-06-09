import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(["pullRequestNumber"])
export class PullRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  pullRequestNumber: number;

  @Column("timestamp with time zone")
  createdAt: Date;

  constructor(initializer: { pullRequestNumber: number; createdAt: Date }) {
    Object.assign(this, initializer);
  }
}
