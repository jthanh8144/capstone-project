import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddSignalAndDeviceTable1683466926133
  implements MigrationInterface
{
  name = 'AddSignalAndDeviceTable1683466926133'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "signal_stores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "registration_id" integer NOT NULL, "ik_public_key" text NOT NULL, "spk_key_id" integer NOT NULL, "spk_public_key" text NOT NULL, "spk_signature" text NOT NULL, "pk_key_id" integer NOT NULL, "pk_public_key" text NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_251093b6979b6f66216be4aa0d1" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "devices" ("id" SERIAL NOT NULL, "device_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_2667f40edb344d6f274a0d42b6f" UNIQUE ("device_id"), CONSTRAINT "PK_b1514758245c12daf43486dd1f0" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_2667f40edb344d6f274a0d42b6" ON "devices" ("device_id") `,
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
      `DROP INDEX "public"."IDX_2667f40edb344d6f274a0d42b6"`,
    )
    await queryRunner.query(`DROP TABLE "devices"`)
    await queryRunner.query(`DROP TABLE "signal_stores"`)
  }
}
