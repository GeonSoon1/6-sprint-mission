/*
  Warnings:

  - You are about to drop the column `content` on the `Article` table. All the data in the column will be lost.
  - Made the column `productId` on table `Comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `articleId` on table `Comment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "content";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "productId" SET NOT NULL,
ALTER COLUMN "articleId" SET NOT NULL;
