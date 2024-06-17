-- AlterTable
ALTER TABLE "user_tokens" ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "admin_id" DROP NOT NULL;
