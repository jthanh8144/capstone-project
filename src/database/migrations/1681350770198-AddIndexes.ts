import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIndexes1681350770198 implements MigrationInterface {
  name = 'AddIndexes1681350770198'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_21e005f3cd857dcbd8b3da5508" ON "friend_requests" ("requester_id", "receiver_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_8b4ce6fbf36903b8f4c503a233" ON "conservations" ("creator_id") `,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4b539d75b8e9dfe483c81396d1" ON "participants" ("conservation_id", "user_id") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_db6fb09f5689da90f5c960e86f" ON "messages" ("sender_id", "conservation_id") `,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5ff034c9ab3fb1dbd9a4d71a2a" ON "conservation_settings" ("user_id", "conservation_id") `,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5ff034c9ab3fb1dbd9a4d71a2a"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_db6fb09f5689da90f5c960e86f"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4b539d75b8e9dfe483c81396d1"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8b4ce6fbf36903b8f4c503a233"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_21e005f3cd857dcbd8b3da5508"`,
    )
  }
}
