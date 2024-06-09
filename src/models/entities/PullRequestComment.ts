import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { PullRequest } from "./PullRequest";
import { EntityInitializer } from "../types";

@Entity()
@Unique(["externalCommentId"])
export class PullRequestComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  externalCommentId: string;

  @Column("text")
  body: string;

  @Column("text")
  diffHunk: string;

  @Column("jsonb")
  raw: Record<string, any>;

  @Column("text")
  authorLogin: string;

  @Column("timestamp with time zone")
  createdAt: Date;

  @Column("integer")
  @ManyToOne(() => PullRequest, (pullRequest) => pullRequest.id)
  @JoinColumn({ name: "pull_request_id" })
  pullRequestId: number;
}

export type PullRequestCommentData = Omit<
  EntityInitializer<PullRequestComment>,
  "pullRequestId"
>;
