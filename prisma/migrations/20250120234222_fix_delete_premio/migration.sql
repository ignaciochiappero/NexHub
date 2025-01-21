-- DropForeignKey
ALTER TABLE `LogroPremio` DROP FOREIGN KEY `LogroPremio_logroId_fkey`;

-- DropForeignKey
ALTER TABLE `LogroPremio` DROP FOREIGN KEY `LogroPremio_premioId_fkey`;

-- AddForeignKey
ALTER TABLE `LogroPremio` ADD CONSTRAINT `LogroPremio_logroId_fkey` FOREIGN KEY (`logroId`) REFERENCES `Logro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogroPremio` ADD CONSTRAINT `LogroPremio_premioId_fkey` FOREIGN KEY (`premioId`) REFERENCES `Premio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
