import { MigrationInterface, QueryRunner } from "typeorm";

export class Sh1717892014621 implements MigrationInterface {
    name = 'Sh1717892014621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "content" ADD "text" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "content" DROP CONSTRAINT "FK_8cfda91f4168db113d7dc1c3773"`);
        await queryRunner.query(`ALTER TABLE "content" ALTER COLUMN "pull_request_comment_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "content" ADD CONSTRAINT "FK_8cfda91f4168db113d7dc1c3773" FOREIGN KEY ("pull_request_comment_id") REFERENCES "pull_request_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "content" DROP CONSTRAINT "FK_8cfda91f4168db113d7dc1c3773"`);
        await queryRunner.query(`ALTER TABLE "content" ALTER COLUMN "pull_request_comment_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "content" ADD CONSTRAINT "FK_8cfda91f4168db113d7dc1c3773" FOREIGN KEY ("pull_request_comment_id") REFERENCES "pull_request_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "content" DROP COLUMN "text"`);
    }

}
