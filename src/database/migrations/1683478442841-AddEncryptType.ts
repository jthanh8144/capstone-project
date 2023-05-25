import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddEncryptType1683478442841 implements MigrationInterface {
  name = 'AddEncryptType1683478442841'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."messages_encrypt_type_enum" AS ENUM('1', '3')`,
    )
    await queryRunner.query(
      `ALTER TABLE "messages" ADD "encrypt_type" "public"."messages_encrypt_type_enum" NOT NULL DEFAULT '1'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "encrypt_type"`)
    await queryRunner.query(`DROP TYPE "public"."messages_encrypt_type_enum"`)
  }
}
