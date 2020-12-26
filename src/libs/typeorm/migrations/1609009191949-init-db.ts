import {MigrationInterface, QueryRunner} from "typeorm";

export class initDb1609009191949 implements MigrationInterface {
    name = 'initDb1609009191949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" character varying NOT NULL, "full_name" character varying NOT NULL, "gender" character varying NOT NULL, "date_of_birth" TIMESTAMP NOT NULL, "address" character varying NOT NULL, "is_soft_deleted" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0adc0a8834ea0f252e96d154de" ON "users" ("full_name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_0adc0a8834ea0f252e96d154de"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
