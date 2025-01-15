/*
  Warnings:

  - You are about to drop the column `completed` on the `Logro` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `Logro` table. All the data in the column will be lost.
  - You are about to drop the column `stepsProgress` on the `Logro` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Logro` DROP COLUMN `completed`,
    DROP COLUMN `progress`,
    DROP COLUMN `stepsProgress`,
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateTable
CREATE TABLE `UserAchievement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `logroId` INTEGER NOT NULL,
    `stepsProgress` INTEGER NOT NULL DEFAULT 0,
    `progress` DOUBLE NOT NULL DEFAULT 0,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserAchievement_userId_logroId_key`(`userId`, `logroId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AchievementRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `logroId` INTEGER NOT NULL,
    `step` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserAchievement` ADD CONSTRAINT `UserAchievement_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAchievement` ADD CONSTRAINT `UserAchievement_logroId_fkey` FOREIGN KEY (`logroId`) REFERENCES `Logro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AchievementRequest` ADD CONSTRAINT `AchievementRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AchievementRequest` ADD CONSTRAINT `AchievementRequest_logroId_fkey` FOREIGN KEY (`logroId`) REFERENCES `Logro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
