/*
  Warnings:

  - You are about to drop the column `email_verification_link_expiry` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_email_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `reset_password_expiry` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `reset_password_token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `verification_code` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `verification_code_expiry` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `verification_link` on the `users` table. All the data in the column will be lost.
  - Added the required column `company` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country_region` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street_address` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medias" ADD COLUMN     "product_id" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email_verification_link_expiry",
DROP COLUMN "is_email_verified",
DROP COLUMN "is_verified",
DROP COLUMN "reset_password_expiry",
DROP COLUMN "reset_password_token",
DROP COLUMN "role",
DROP COLUMN "verification_code",
DROP COLUMN "verification_code_expiry",
DROP COLUMN "verification_link",
ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "country_region" TEXT NOT NULL,
ADD COLUMN     "street_address" TEXT NOT NULL;

-- DropEnum
DROP TYPE "UserRole";

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
