/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_id` to the `Colors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Colors" ADD COLUMN     "product_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Products_title_key" ON "Products"("title");

-- AddForeignKey
ALTER TABLE "Colors" ADD CONSTRAINT "Colors_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
