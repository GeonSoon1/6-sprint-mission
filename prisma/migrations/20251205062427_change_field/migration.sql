/*
  Warnings:

  - Made the column `articleId` on table `ArticleLike` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `ProductLike` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ArticleLike" DROP CONSTRAINT "ArticleLike_articleId_fkey";

-- DropForeignKey
ALTER TABLE "ProductLike" DROP CONSTRAINT "ProductLike_productId_fkey";

-- AlterTable
ALTER TABLE "ArticleLike" ALTER COLUMN "articleId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductLike" ALTER COLUMN "productId" SET NOT NULL;

-- DropEnum
DROP TYPE "LikeType";

-- AddForeignKey
ALTER TABLE "ArticleLike" ADD CONSTRAINT "ArticleLike_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductLike" ADD CONSTRAINT "ProductLike_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
