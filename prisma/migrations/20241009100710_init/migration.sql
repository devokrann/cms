/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `posts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "posts_user_id_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "posts_title_key" ON "posts"("title");
