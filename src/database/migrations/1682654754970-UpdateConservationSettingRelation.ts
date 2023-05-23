import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateConservationSettingRelation1682654754970
  implements MigrationInterface
{
  name = 'UpdateConservationSettingRelation1682654754970'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conservation_settings" DROP COLUMN "aut_remove_after"`,
    )
    await queryRunner.query(
      `ALTER TABLE "conservation_settings" ADD "auto_remove_after" integer NOT NULL DEFAULT '30'`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5ff034c9ab3fb1dbd9a4d71a2a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "conservation_settings" DROP COLUMN "conservation_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "conservation_settings" ADD "conservation_id" uuid NOT NULL`,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5ff034c9ab3fb1dbd9a4d71a2a" ON "conservation_settings" ("user_id", "conservation_id") `,
    )
    await queryRunner.query(
      `ALTER TABLE "conservation_settings" ADD CONSTRAINT "fk_70aa68010243ac3de394c3ab9b0f6972" FOREIGN KEY ("conservation_id") REFERENCES "conservations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conservation_settings" DROP CONSTRAINT "fk_70aa68010243ac3de394c3ab9b0f6972"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5ff034c9ab3fb1dbd9a4d71a2a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "conservation_settings" DROP COLUMN "conservation_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "conservation_settings" ADD "conservation_id" character varying NOT NULL`,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5ff034c9ab3fb1dbd9a4d71a2a" ON "conservation_settings" ("user_id", "conservation_id") `,
    )
    await queryRunner.query(
      `ALTER TABLE "conservation_settings" DROP COLUMN "auto_remove_after"`,
    )
    await queryRunner.query(
      `ALTER TABLE "conservation_settings" ADD "aut_remove_after" integer NOT NULL DEFAULT '0'`,
    )
  }
}
