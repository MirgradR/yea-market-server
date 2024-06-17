/*
  Warnings:

  - A unique constraint covering the columns `[admin_id]` on the table `user_tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `admin_id` to the `user_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_tokens" ADD COLUMN     "admin_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_tokens_admin_id_key" ON "user_tokens"("admin_id");

-- AddForeignKey
ALTER TABLE "user_tokens" ADD CONSTRAINT "user_tokens_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
