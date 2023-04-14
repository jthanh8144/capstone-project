import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddOnDelete1681440439579 implements MigrationInterface {
  name = 'AddOnDelete1681440439579'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "friend_requests" DROP CONSTRAINT "fk_c3036de203bb6f783004d599e6f949eb"`,
    )
    await queryRunner.query(
      `ALTER TABLE "friend_requests" DROP CONSTRAINT "fk_a6a2afe4e0151b4e5af7a3792de335ad"`,
    )
    await queryRunner.query(
      `ALTER TABLE "conservations" DROP CONSTRAINT "fk_8ea93d4c895b557c66be75762a90df65"`,
    )
    await queryRunner.query(
      `ALTER TABLE "participants" DROP CONSTRAINT "fk_aafb07707aa529a00e3c70ec9cbb6101"`,
    )
    await queryRunner.query(
      `ALTER TABLE "participants" DROP CONSTRAINT "fk_dc9e3fe3199ea696e26a219577aa9ce9"`,
    )
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "fk_c7810256abc1acf480de59e05fa7c93a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "fk_e2bc7fde440ee2e73f8ab2126a1da131"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_tokens" DROP CONSTRAINT "fk_e24dfb1c1f3a9be6e2e34aa589944ec0"`,
    )
    await queryRunner.query(
      `ALTER TABLE "verify_requests" DROP CONSTRAINT "fk_712e2e7eb6b8dac316d588087e23689c"`,
    )
    await queryRunner.query(
      `ALTER TABLE "conservation_settings" DROP CONSTRAINT "fk_8f0912e58bb783bf4d6d76a6e4be09b3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "friend_requests" ADD CONSTRAINT "fk_c3036de203bb6f783004d599e6f949eb" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "friend_requests" ADD CONSTRAINT "fk_a6a2afe4e0151b4e5af7a3792de335ad" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "conservations" ADD CONSTRAINT "fk_8ea93d4c895b557c66be75762a90df65" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "participants" ADD CONSTRAINT "fk_aafb07707aa529a00e3c70ec9cbb6101" FOREIGN KEY ("conservation_id") REFERENCES "conservations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "participants" ADD CONSTRAINT "fk_dc9e3fe3199ea696e26a219577aa9ce9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "fk_c7810256abc1acf480de59e05fa7c93a" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "fk_e2bc7fde440ee2e73f8ab2126a1da131" FOREIGN KEY ("conservation_id") REFERENCES "conservations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_tokens" ADD CONSTRAINT "fk_e24dfb1c1f3a9be6e2e34aa589944ec0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "verify_requests" ADD CONSTRAINT "fk_712e2e7eb6b8dac316d588087e23689c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "conservation_settings" ADD CONSTRAINT "fk_8f0912e58bb783bf4d6d76a6e4be09b3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conservation_settings" DROP CONSTRAINT "fk_8f0912e58bb783bf4d6d76a6e4be09b3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "verify_requests" DROP CONSTRAINT "fk_712e2e7eb6b8dac316d588087e23689c"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_tokens" DROP CONSTRAINT "fk_e24dfb1c1f3a9be6e2e34aa589944ec0"`,
    )
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "fk_e2bc7fde440ee2e73f8ab2126a1da131"`,
    )
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "fk_c7810256abc1acf480de59e05fa7c93a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "participants" DROP CONSTRAINT "fk_dc9e3fe3199ea696e26a219577aa9ce9"`,
    )
    await queryRunner.query(
      `ALTER TABLE "participants" DROP CONSTRAINT "fk_aafb07707aa529a00e3c70ec9cbb6101"`,
    )
    await queryRunner.query(
      `ALTER TABLE "conservations" DROP CONSTRAINT "fk_8ea93d4c895b557c66be75762a90df65"`,
    )
    await queryRunner.query(
      `ALTER TABLE "friend_requests" DROP CONSTRAINT "fk_a6a2afe4e0151b4e5af7a3792de335ad"`,
    )
    await queryRunner.query(
      `ALTER TABLE "friend_requests" DROP CONSTRAINT "fk_c3036de203bb6f783004d599e6f949eb"`,
    )
    await queryRunner.query(
      `ALTER TABLE "conservation_settings" ADD CONSTRAINT "fk_8f0912e58bb783bf4d6d76a6e4be09b3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "verify_requests" ADD CONSTRAINT "fk_712e2e7eb6b8dac316d588087e23689c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_tokens" ADD CONSTRAINT "fk_e24dfb1c1f3a9be6e2e34aa589944ec0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "fk_e2bc7fde440ee2e73f8ab2126a1da131" FOREIGN KEY ("conservation_id") REFERENCES "conservations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "fk_c7810256abc1acf480de59e05fa7c93a" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "participants" ADD CONSTRAINT "fk_dc9e3fe3199ea696e26a219577aa9ce9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "participants" ADD CONSTRAINT "fk_aafb07707aa529a00e3c70ec9cbb6101" FOREIGN KEY ("conservation_id") REFERENCES "conservations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "conservations" ADD CONSTRAINT "fk_8ea93d4c895b557c66be75762a90df65" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "friend_requests" ADD CONSTRAINT "fk_a6a2afe4e0151b4e5af7a3792de335ad" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "friend_requests" ADD CONSTRAINT "fk_c3036de203bb6f783004d599e6f949eb" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
