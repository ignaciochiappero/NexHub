/*
  Warnings:

  - Added the required column `imagen` to the `Premio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logroId` to the `Premio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtitulo` to the `Premio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Premio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Premio` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `imagen` VARCHAR(191) NOT NULL,
    ADD COLUMN `logroId` INTEGER NOT NULL,
    ADD COLUMN `subtitulo` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `Premio` ADD CONSTRAINT `Premio_logroId_fkey` FOREIGN KEY (`logroId`) REFERENCES `Logro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
