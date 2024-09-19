/*
  Warnings:

  - The values [ADMIN,DEV] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `description` on the `posts` table. All the data in the column will be lost.
  - Added the required column `content` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'ADMINISTRATOR', 'DEVELOPER');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "description",
ADD COLUMN     "content" TEXT NOT NULL;
