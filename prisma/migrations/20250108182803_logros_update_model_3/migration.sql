/*
  Warnings:

  - You are about to drop the column `steps` on the `Logro` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Logro` DROP COLUMN `steps`,
    ADD COLUMN `completed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `progress` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `stepsFinal` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `stepsProgress` INTEGER NOT NULL DEFAULT 0,
    MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `icon` VARCHAR(191) NOT NULL DEFAULT 'Trophy';
