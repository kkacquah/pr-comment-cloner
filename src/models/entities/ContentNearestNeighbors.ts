import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Content } from "./Content";

@Entity()
export class ContentNearestNeighbors {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Content, (content) => content.id, {
    cascade: true,
  })
  @JoinColumn({ name: "content_id" })
  contentId: number;

  @ManyToOne(() => Content, (content) => content.id, {
    cascade: true,
  })
  @JoinColumn({ name: "neighbor_content_id" })
  neighborContentId: number;

  @Column({ type: "double precision" })
  distance: number;
}
