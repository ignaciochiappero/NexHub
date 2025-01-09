/*
  Warnings:

  - You are about to drop the `_HiddenConversations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_HiddenConversations` DROP FOREIGN KEY `_HiddenConversations_A_fkey`;

-- DropForeignKey
ALTER TABLE `_HiddenConversations` DROP FOREIGN KEY `_HiddenConversations_B_fkey`;

-- DropTable
DROP TABLE `_HiddenConversations`;
