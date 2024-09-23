/*
  Warnings:

  - You are about to drop the column `published` on the `posts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `tags` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "published";

-- CreateIndex
CREATE UNIQUE INDEX "categories_title_key" ON "categories"("title");

-- CreateIndex
CREATE UNIQUE INDEX "tags_title_key" ON "tags"("title");
