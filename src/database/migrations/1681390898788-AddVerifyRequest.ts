import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddVerifyRequest1681390898788 implements MigrationInterface {
  name = 'AddVerifyRequest1681390898788'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."verify_requests_status_enum" AS ENUM('pending', 'expired', 'done')`,
    )
    await queryRunner.query(
      `CREATE TABLE "verify_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."verify_requests_status_enum" NOT NULL, "expired_time" TIMESTAMP NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_8f3ad312b087c491165b312ef00" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "verify_requests" ADD CONSTRAINT "fk_712e2e7eb6b8dac316d588087e23689c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verify_requests" DROP CONSTRAINT "fk_712e2e7eb6b8dac316d588087e23689c"`,
    )
    await queryRunner.query(`DROP TABLE "verify_requests"`)
    await queryRunner.query(`DROP TYPE "public"."verify_requests_status_enum"`)
  }
}
