/*
  Warnings:

  - You are about to drop the column `content` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `CommentToArticle` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `CommentToProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "content";

-- AlterTable
ALTER TABLE "CommentToArticle" DROP COLUMN "comment",
ADD COLUMN     "content" TEXT;

-- AlterTable
ALTER TABLE "CommentToProduct" DROP COLUMN "comment",
ADD COLUMN     "content" TEXT;
