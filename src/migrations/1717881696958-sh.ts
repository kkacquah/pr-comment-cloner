import { MigrationInterface, QueryRunner } from "typeorm";

export class Sh1717881696958 implements MigrationInterface {
    name = 'Sh1717881696958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "embedding" ("id" SERIAL NOT NULL, "vector" double precision array, CONSTRAINT "PK_9457e810efc9c802fe5047347d6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pull_request" ("id" SERIAL NOT NULL, "pull_request_number" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "UQ_47d75727b8a38ecfaf36fcb6ad2" UNIQUE ("pull_request_number"), CONSTRAINT "PK_2db8fa2766816707ba4a89ca9d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pull_request_comment" ("id" SERIAL NOT NULL, "external_comment_id" character varying NOT NULL, "body" text NOT NULL, "diff_hunk" text NOT NULL, "raw" jsonb NOT NULL, "author_login" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "pull_request_id" integer NOT NULL, CONSTRAINT "UQ_dbd45312c8f3c1e209d5178328d" UNIQUE ("external_comment_id"), CONSTRAINT "PK_dd2fe2072c2052b1d14814cf349" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."content_type_enum" AS ENUM('diffHunk', 'comment')`);
        await queryRunner.query(`CREATE TABLE "content" ("id" SERIAL NOT NULL, "type" "public"."content_type_enum" NOT NULL, "pull_request_comment_id" integer, CONSTRAINT "PK_6a2083913f3647b44f205204e36" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "content_embedding_mapping" ("id" SERIAL NOT NULL, "content_id" integer, "embedding_id" integer, CONSTRAINT "PK_48423f4dab41a51901922a4cb7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pull_request_comment" ADD CONSTRAINT "FK_e9290bad2e3fa0e87e2b0ebc3cb" FOREIGN KEY ("pull_request_id") REFERENCES "pull_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "content" ADD CONSTRAINT "FK_8cfda91f4168db113d7dc1c3773" FOREIGN KEY ("pull_request_comment_id") REFERENCES "pull_request_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "content_embedding_mapping" ADD CONSTRAINT "FK_cc9f56bebda4fdc31c246763a82" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "content_embedding_mapping" ADD CONSTRAINT "FK_3f339d2bce9bd500fd9ab115be5" FOREIGN KEY ("embedding_id") REFERENCES "embedding"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "content_embedding_mapping" DROP CONSTRAINT "FK_3f339d2bce9bd500fd9ab115be5"`);
        await queryRunner.query(`ALTER TABLE "content_embedding_mapping" DROP CONSTRAINT "FK_cc9f56bebda4fdc31c246763a82"`);
        await queryRunner.query(`ALTER TABLE "content" DROP CONSTRAINT "FK_8cfda91f4168db113d7dc1c3773"`);
        await queryRunner.query(`ALTER TABLE "pull_request_comment" DROP CONSTRAINT "FK_e9290bad2e3fa0e87e2b0ebc3cb"`);
        await queryRunner.query(`DROP TABLE "content_embedding_mapping"`);
        await queryRunner.query(`DROP TABLE "content"`);
        await queryRunner.query(`DROP TYPE "public"."content_type_enum"`);
        await queryRunner.query(`DROP TABLE "pull_request_comment"`);
        await queryRunner.query(`DROP TABLE "pull_request"`);
        await queryRunner.query(`DROP TABLE "embedding"`);
    }

}
