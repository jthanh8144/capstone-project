import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddVerifyCode1681892986242 implements MigrationInterface {
  name = 'AddVerifyCode1681892986242'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "verify_codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "code" character varying NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "expired_time" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_321d3f831892a0af045143c4e7b" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_e371eb5de58634ed9ae96e4d8d" ON "verify_codes" ("email", "code") `,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e371eb5de58634ed9ae96e4d8d"`,
    )
    await queryRunner.query(`DROP TABLE "verify_codes"`)
  }
}
