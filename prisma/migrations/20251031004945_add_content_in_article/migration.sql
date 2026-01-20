/*
  Warnings:

  - Added the required column `content` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `CommentToArticle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `CommentToProduct` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "content" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CommentToArticle" ALTER COLUMN "content" SET NOT NULL;

-- AlterTable
ALTER TABLE "CommentToProduct" ALTER COLUMN "content" SET NOT NULL;
