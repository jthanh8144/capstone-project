import { MigrationInterface, QueryRunner } from 'typeorm'

export class Initial1681308211437 implements MigrationInterface {
  name = 'Initial1681308211437'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET TIME ZONE 'UTC'`)
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "full_name" character varying, "avatar_url" character varying, "is_verified" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."friend_requests_status_enum" AS ENUM('accepted', 'declined', 'pending')`,
    )
    await queryRunner.query(
      `CREATE TABLE "friend_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."friend_requests_status_enum" NOT NULL, "requester_id" uuid NOT NULL, "receiver_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_3827ba86ce64ecb4b90c92eeea6" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "participants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "conservation_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_1cda06c31eec1c95b3365a0283f" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "conservation_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_muted" boolean NOT NULL DEFAULT false, "is_removed" boolean NOT NULL DEFAULT false, "is_archived" boolean NOT NULL DEFAULT false, "aut_remove_after" integer NOT NULL DEFAULT '0', "user_id" uuid NOT NULL, "conservation_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_302c88d5cd78617e48660a94a2c" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."messages_message_type_enum" AS ENUM('text', 'image', 'video', 'another')`,
    )
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" text NOT NULL, "message_type" "public"."messages_message_type_enum" NOT NULL, "is_removed" boolean NOT NULL DEFAULT false, "sender_id" uuid NOT NULL, "conservation_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."conservations_type_enum" AS ENUM('normal', 'secret')`,
    )
    await queryRunner.query(
      `CREATE TABLE "conservations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "creator_id" uuid NOT NULL, "type" "public"."conservations_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_ff1ab3fc7a3aaed1aa56d9d1e2b" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "friend_requests" ADD CONSTRAINT "fk_c3036de203bb6f783004d599e6f949eb" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "friend_requests" ADD CONSTRAINT "fk_a6a2afe4e0151b4e5af7a3792de335ad" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "participants" ADD CONSTRAINT "fk_aafb07707aa529a00e3c70ec9cbb6101" FOREIGN KEY ("conservation_id") REFERENCES "conservations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "participants" ADD CONSTRAINT "fk_dc9e3fe3199ea696e26a219577aa9ce9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "conservation_settings" ADD CONSTRAINT "fk_8f0912e58bb783bf4d6d76a6e4be09b3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "fk_c7810256abc1acf480de59e05fa7c93a" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "fk_e2bc7fde440ee2e73f8ab2126a1da131" FOREIGN KEY ("conservation_id") REFERENCES "conservations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "conservations" ADD CONSTRAINT "fk_8ea93d4c895b557c66be75762a90df65" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conservations" DROP CONSTRAINT "fk_8ea93d4c895b557c66be75762a90df65"`,
    )
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "fk_e2bc7fde440ee2e73f8ab2126a1da131"`,
    )
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "fk_c7810256abc1acf480de59e05fa7c93a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "conservation_settings" DROP CONSTRAINT "fk_8f0912e58bb783bf4d6d76a6e4be09b3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "participants" DROP CONSTRAINT "fk_dc9e3fe3199ea696e26a219577aa9ce9"`,
    )
    await queryRunner.query(
      `ALTER TABLE "participants" DROP CONSTRAINT "fk_aafb07707aa529a00e3c70ec9cbb6101"`,
    )
    await queryRunner.query(
      `ALTER TABLE "friend_requests" DROP CONSTRAINT "fk_a6a2afe4e0151b4e5af7a3792de335ad"`,
    )
    await queryRunner.query(
      `ALTER TABLE "friend_requests" DROP CONSTRAINT "fk_c3036de203bb6f783004d599e6f949eb"`,
    )
    await queryRunner.query(`DROP TABLE "conservations"`)
    await queryRunner.query(`DROP TYPE "public"."conservations_type_enum"`)
    await queryRunner.query(`DROP TABLE "messages"`)
    await queryRunner.query(`DROP TYPE "public"."messages_message_type_enum"`)
    await queryRunner.query(`DROP TABLE "conservation_settings"`)
    await queryRunner.query(`DROP TABLE "participants"`)
    await queryRunner.query(`DROP TABLE "friend_requests"`)
    await queryRunner.query(`DROP TYPE "public"."friend_requests_status_enum"`)
    await queryRunner.query(`DROP TABLE "users"`)
  }
}
