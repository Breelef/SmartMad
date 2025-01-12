-- DropForeignKey
ALTER TABLE `recipes` DROP FOREIGN KEY `recipes_aiResponseId_fkey`;

-- DropIndex
DROP INDEX `recipes_aiResponseId_fkey` ON `recipes`;

-- AddForeignKey
ALTER TABLE `recipes` ADD CONSTRAINT `recipes_aiResponseId_fkey` FOREIGN KEY (`aiResponseId`) REFERENCES `aiResponses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
