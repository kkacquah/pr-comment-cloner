import { MigrationInterface, QueryRunner } from "typeorm";

export class Sh1717957009853 implements MigrationInterface {
    name = 'Sh1717957009853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "content_nearest_neighbors" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "distance" double precision NOT NULL, "content_id" integer, "neighbor_content_id" integer, CONSTRAINT "PK_9d2578cd10d73abdcbeea13bd93" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "content_nearest_neighbors" ADD CONSTRAINT "FK_3a75c57a20cbcd53a1e9091ba6a" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "content_nearest_neighbors" ADD CONSTRAINT "FK_6855d8ba80d2a732e0a0397cf51" FOREIGN KEY ("neighbor_content_id") REFERENCES "content"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "content_nearest_neighbors" DROP CONSTRAINT "FK_6855d8ba80d2a732e0a0397cf51"`);
        await queryRunner.query(`ALTER TABLE "content_nearest_neighbors" DROP CONSTRAINT "FK_3a75c57a20cbcd53a1e9091ba6a"`);
        await queryRunner.query(`DROP TABLE "content_nearest_neighbors"`);
    }

}
