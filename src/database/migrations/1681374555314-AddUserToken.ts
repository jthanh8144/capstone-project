import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserToken1681374555314 implements MigrationInterface {
  name = 'AddUserToken1681374555314'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" text NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_63764db9d9aaa4af33e07b2f4bf" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_tokens" ADD CONSTRAINT "fk_e24dfb1c1f3a9be6e2e34aa589944ec0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_tokens" DROP CONSTRAINT "fk_e24dfb1c1f3a9be6e2e34aa589944ec0"`,
    )
    await queryRunner.query(`DROP TABLE "user_tokens"`)
  }
}
