import { MigrationInterface, QueryRunner } from "typeorm";
import { vectorDbService } from "../data-source";

export class Sh1717907124813 implements MigrationInterface {
  name = "Sh1717907124813";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content_embedding_mapping" DROP CONSTRAINT "FK_3f339d2bce9bd500fd9ab115be5"`
    );
    await queryRunner.query(
      `ALTER TABLE "content_embedding_mapping" ALTER COLUMN "embedding_id" SET NOT NULL`
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "content_embedding_mapping_embedding_id_seq" OWNED BY "content_embedding_mapping"."embedding_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "content_embedding_mapping" ALTER COLUMN "embedding_id" SET DEFAULT nextval('"content_embedding_mapping_embedding_id_seq"')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content_embedding_mapping" ALTER COLUMN "embedding_id" DROP DEFAULT`
    );
    await queryRunner.query(
      `DROP SEQUENCE "content_embedding_mapping_embedding_id_seq"`
    );
    await queryRunner.query(
      `ALTER TABLE "content_embedding_mapping" ALTER COLUMN "embedding_id" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "content_embedding_mapping" ADD CONSTRAINT "FK_3f339d2bce9bd500fd9ab115be5" FOREIGN KEY ("embedding_id") REFERENCES "embedding"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
