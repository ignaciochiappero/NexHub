/*
  Warnings:

  - You are about to drop the column `logroId` on the `Premio` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Premio` DROP FOREIGN KEY `Premio_logroId_fkey`;

-- AlterTable
ALTER TABLE `Premio` DROP COLUMN `logroId`;

-- CreateTable
CREATE TABLE `LogroPremio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logroId` INTEGER NOT NULL,
    `premioId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LogroPremio_logroId_premioId_key`(`logroId`, `premioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LogroPremio` ADD CONSTRAINT `LogroPremio_logroId_fkey` FOREIGN KEY (`logroId`) REFERENCES `Logro`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogroPremio` ADD CONSTRAINT `LogroPremio_premioId_fkey` FOREIGN KEY (`premioId`) REFERENCES `Premio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
