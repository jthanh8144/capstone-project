import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddFCMToken1685084666609 implements MigrationInterface {
  name = 'AddFCMToken1685084666609'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "fcm_token" character varying`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fcm_token"`)
  }
}
