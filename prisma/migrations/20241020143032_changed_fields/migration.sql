/*
  Warnings:

  - You are about to drop the column `coverURL` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `emojiURL` on the `Project` table. All the data in the column will be lost.
  - Added the required column `cover` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emoji` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "coverURL",
DROP COLUMN "emojiURL",
ADD COLUMN     "cover" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "emoji" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
