import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateSignalRelation1684053893129 implements MigrationInterface {
  name = 'UpdateSignalRelation1684053893129'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "signal_stores" DROP CONSTRAINT "fk_1bd1b2cfcd4e2c4ee7123db94420cae7"`,
    )
    await queryRunner.query(
      `ALTER TABLE "signal_stores" ADD CONSTRAINT "UQ_9dad7e16d3441bd70c70b7c0322" UNIQUE ("user_id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "signal_stores" ADD CONSTRAINT "fk_1bd1b2cfcd4e2c4ee7123db94420cae7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "signal_stores" DROP CONSTRAINT "fk_1bd1b2cfcd4e2c4ee7123db94420cae7"`,
    )
    await queryRunner.query(
      `ALTER TABLE "signal_stores" DROP CONSTRAINT "UQ_9dad7e16d3441bd70c70b7c0322"`,
    )
    await queryRunner.query(
      `ALTER TABLE "signal_stores" ADD CONSTRAINT "fk_1bd1b2cfcd4e2c4ee7123db94420cae7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }
}
