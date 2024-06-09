import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePgVectorExtension implements MigrationInterface {
  name = "CreatePgVectorExtension1678215406807";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE EXTENSION IF NOT EXISTS pg_trgm");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION IF EXISTS pg_trgm`);
  }
}
