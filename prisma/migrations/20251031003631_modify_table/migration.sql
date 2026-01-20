/*
  Warnings:

  - You are about to drop the column `content` on the `CommentToArticle` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `CommentToProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "content" TEXT;

-- AlterTable
ALTER TABLE "CommentToArticle" DROP COLUMN "content",
ADD COLUMN     "comment" TEXT;

-- AlterTable
ALTER TABLE "CommentToProduct" DROP COLUMN "content",
ADD COLUMN     "comment" TEXT;
