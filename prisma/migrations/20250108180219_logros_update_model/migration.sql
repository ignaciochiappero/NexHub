/*
  Warnings:

  - Added the required column `icon` to the `Logro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `steps` to the `Logro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Logro` ADD COLUMN `icon` VARCHAR(191) NOT NULL,
    ADD COLUMN `steps` INTEGER NOT NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT;
