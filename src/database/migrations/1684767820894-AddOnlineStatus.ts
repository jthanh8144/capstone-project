import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddOnlineStatus1684767820894 implements MigrationInterface {
  name = 'AddOnlineStatus1684767820894'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "is_online" boolean NOT NULL DEFAULT false`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_online"`)
  }
}
