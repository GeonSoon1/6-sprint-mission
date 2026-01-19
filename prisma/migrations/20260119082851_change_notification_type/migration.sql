/*
  Warnings:

  - You are about to drop the column `message` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NOTIFICATION" AS ENUM ('priceChange', 'productComment', 'articleComment');

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "message",
ADD COLUMN     "type" "NOTIFICATION" NOT NULL;
