-- DropForeignKey
ALTER TABLE `aiResponses` DROP FOREIGN KEY `aiResponses_userPromptId_fkey`;

-- DropForeignKey
ALTER TABLE `instructions` DROP FOREIGN KEY `instructions_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `modificationResponses` DROP FOREIGN KEY `modificationResponses_aiResponseId_fkey`;

-- DropForeignKey
ALTER TABLE `modificationResponses` DROP FOREIGN KEY `modificationResponses_modificationId_fkey`;

-- DropForeignKey
ALTER TABLE `recipeIngredients` DROP FOREIGN KEY `recipeIngredients_ingredientId_fkey`;

-- DropForeignKey
ALTER TABLE `recipeIngredients` DROP FOREIGN KEY `recipeIngredients_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `recipeModifications` DROP FOREIGN KEY `recipeModifications_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `recipeModifications` DROP FOREIGN KEY `recipeModifications_userPromptId_fkey`;

-- DropForeignKey
ALTER TABLE `userPrompts` DROP FOREIGN KEY `userPrompts_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userRecipes` DROP FOREIGN KEY `userRecipes_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `userRecipes` DROP FOREIGN KEY `userRecipes_userId_fkey`;

-- DropIndex
DROP INDEX `instructions_recipeId_fkey` ON `instructions`;

-- DropIndex
DROP INDEX `modificationResponses_aiResponseId_fkey` ON `modificationResponses`;

-- DropIndex
DROP INDEX `modificationResponses_modificationId_fkey` ON `modificationResponses`;

-- DropIndex
DROP INDEX `recipeIngredients_ingredientId_fkey` ON `recipeIngredients`;

-- DropIndex
DROP INDEX `recipeModifications_recipeId_fkey` ON `recipeModifications`;

-- DropIndex
DROP INDEX `recipeModifications_userPromptId_fkey` ON `recipeModifications`;

-- DropIndex
DROP INDEX `userPrompts_userId_fkey` ON `userPrompts`;

-- DropIndex
DROP INDEX `userRecipes_recipeId_fkey` ON `userRecipes`;

-- AddForeignKey
ALTER TABLE `userPrompts` ADD CONSTRAINT `userPrompts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aiResponses` ADD CONSTRAINT `aiResponses_userPromptId_fkey` FOREIGN KEY (`userPromptId`) REFERENCES `userPrompts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipeIngredients` ADD CONSTRAINT `recipeIngredients_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipeIngredients` ADD CONSTRAINT `recipeIngredients_ingredientId_fkey` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `instructions` ADD CONSTRAINT `instructions_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipeModifications` ADD CONSTRAINT `recipeModifications_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipeModifications` ADD CONSTRAINT `recipeModifications_userPromptId_fkey` FOREIGN KEY (`userPromptId`) REFERENCES `userPrompts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `modificationResponses` ADD CONSTRAINT `modificationResponses_aiResponseId_fkey` FOREIGN KEY (`aiResponseId`) REFERENCES `aiResponses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `modificationResponses` ADD CONSTRAINT `modificationResponses_modificationId_fkey` FOREIGN KEY (`modificationId`) REFERENCES `recipeModifications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userRecipes` ADD CONSTRAINT `userRecipes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userRecipes` ADD CONSTRAINT `userRecipes_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
