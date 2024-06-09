import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ContentType } from "../enums/ContentType";
import { PullRequestComment } from "./PullRequestComment";

@Entity()
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: Object.values(ContentType),
  })
  type: ContentType;

  @ManyToOne(
    () => PullRequestComment,
    (pullRequestComment) => pullRequestComment.id,
    {
      cascade: true,
    }
  )
  @Column()
  @ManyToOne(
    () => PullRequestComment,
    (pullRequestComment) => pullRequestComment.id
  )
  @JoinColumn({ name: "pull_request_comment_id" })
  pullRequestCommentId: number;

  @Column()
  text: string;
}
