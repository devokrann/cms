/*
  Warnings:

  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusUser" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "StatusPost" AS ENUM ('DRAFT', 'PUBLISHED', 'INACTIVE');

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "allow_comments" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "anonymous" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "StatusPost" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "status",
ADD COLUMN     "status" "StatusUser" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "Status";
