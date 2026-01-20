/*
  Warnings:

  - You are about to drop the `CommentToArticle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommentToArticle" DROP CONSTRAINT "CommentToArticle_articleId_fkey";

-- DropForeignKey
ALTER TABLE "CommentToProduct" DROP CONSTRAINT "CommentToProduct_productId_fkey";

-- DropTable
DROP TABLE "CommentToArticle";

-- DropTable
DROP TABLE "CommentToProduct";

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "productId" INTEGER,
    "articleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
