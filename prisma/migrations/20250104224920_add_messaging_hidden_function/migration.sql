-- CreateTable
CREATE TABLE `_HiddenConversations` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_HiddenConversations_AB_unique`(`A`, `B`),
    INDEX `_HiddenConversations_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_HiddenConversations` ADD CONSTRAINT `_HiddenConversations_A_fkey` FOREIGN KEY (`A`) REFERENCES `Conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_HiddenConversations` ADD CONSTRAINT `_HiddenConversations_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
