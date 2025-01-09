/*
  Warnings:

  - You are about to alter the column `icon` on the `Logro` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Logro` MODIFY `icon` INTEGER NOT NULL;
