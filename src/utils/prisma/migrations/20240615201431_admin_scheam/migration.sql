/*
  Warnings:

  - A unique constraint covering the columns `[phone_number]` on the table `admins` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone_number` to the `admins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "phone_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "admins_phone_number_key" ON "admins"("phone_number");
