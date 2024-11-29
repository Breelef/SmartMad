/*
  Warnings:

  - You are about to drop the `airesponse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ingredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `instruction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `modificationresponse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipeingredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipemodification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userprompt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userrecipe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_recipeingredients` DROP FOREIGN KEY `_RecipeIngredients_A_fkey`;

-- DropForeignKey
ALTER TABLE `_recipeingredients` DROP FOREIGN KEY `_RecipeIngredients_B_fkey`;

-- DropForeignKey
ALTER TABLE `_userrecipes` DROP FOREIGN KEY `_UserRecipes_A_fkey`;

-- DropForeignKey
ALTER TABLE `_userrecipes` DROP FOREIGN KEY `_UserRecipes_B_fkey`;

-- DropForeignKey
ALTER TABLE `airesponse` DROP FOREIGN KEY `AIResponse_userPromptId_fkey`;

-- DropForeignKey
ALTER TABLE `instruction` DROP FOREIGN KEY `Instruction_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `modificationresponse` DROP FOREIGN KEY `ModificationResponse_aiResponseId_fkey`;

-- DropForeignKey
ALTER TABLE `modificationresponse` DROP FOREIGN KEY `ModificationResponse_modificationId_fkey`;

-- DropForeignKey
ALTER TABLE `recipe` DROP FOREIGN KEY `Recipe_aiResponseId_fkey`;

-- DropForeignKey
ALTER TABLE `recipeingredient` DROP FOREIGN KEY `RecipeIngredient_ingredientId_fkey`;

-- DropForeignKey
ALTER TABLE `recipeingredient` DROP FOREIGN KEY `RecipeIngredient_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `recipemodification` DROP FOREIGN KEY `RecipeModification_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `recipemodification` DROP FOREIGN KEY `RecipeModification_userPromptId_fkey`;

-- DropForeignKey
ALTER TABLE `userprompt` DROP FOREIGN KEY `UserPrompt_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userrecipe` DROP FOREIGN KEY `UserRecipe_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `userrecipe` DROP FOREIGN KEY `UserRecipe_userId_fkey`;

-- DropTable
DROP TABLE `airesponse`;

-- DropTable
DROP TABLE `ingredient`;

-- DropTable
DROP TABLE `instruction`;

-- DropTable
DROP TABLE `modificationresponse`;

-- DropTable
DROP TABLE `recipe`;

-- DropTable
DROP TABLE `recipeingredient`;

-- DropTable
DROP TABLE `recipemodification`;

-- DropTable
DROP TABLE `user`;

-- DropTable
DROP TABLE `userprompt`;

-- DropTable
DROP TABLE `userrecipe`;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_prompts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `prompt` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `aiResponseId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ai_responses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userPromptId` INTEGER NOT NULL,
    `response` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `ai_responses_userPromptId_key`(`userPromptId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aiResponseId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `prep` INTEGER NOT NULL,
    `cook` INTEGER NOT NULL,
    `portionSize` INTEGER NOT NULL,
    `finalComment` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_ingredients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipeId` INTEGER NOT NULL,
    `ingredientId` INTEGER NOT NULL,
    `value` DOUBLE NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `comment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingredients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `instructions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipeId` INTEGER NOT NULL,
    `part` INTEGER NOT NULL,
    `steps` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_modifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipeId` INTEGER NOT NULL,
    `userPromptId` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `modification_responses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aiResponseId` INTEGER NOT NULL,
    `modificationId` INTEGER NOT NULL,
    `appliedToRecipe` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_recipes` (
    `userId` INTEGER NOT NULL,
    `recipeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`userId`, `recipeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_prompts` ADD CONSTRAINT `user_prompts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_responses` ADD CONSTRAINT `ai_responses_userPromptId_fkey` FOREIGN KEY (`userPromptId`) REFERENCES `user_prompts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipes` ADD CONSTRAINT `recipes_aiResponseId_fkey` FOREIGN KEY (`aiResponseId`) REFERENCES `ai_responses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredients` ADD CONSTRAINT `recipe_ingredients_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredients` ADD CONSTRAINT `recipe_ingredients_ingredientId_fkey` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `instructions` ADD CONSTRAINT `instructions_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_modifications` ADD CONSTRAINT `recipe_modifications_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_modifications` ADD CONSTRAINT `recipe_modifications_userPromptId_fkey` FOREIGN KEY (`userPromptId`) REFERENCES `user_prompts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `modification_responses` ADD CONSTRAINT `modification_responses_aiResponseId_fkey` FOREIGN KEY (`aiResponseId`) REFERENCES `ai_responses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `modification_responses` ADD CONSTRAINT `modification_responses_modificationId_fkey` FOREIGN KEY (`modificationId`) REFERENCES `recipe_modifications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_recipes` ADD CONSTRAINT `user_recipes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_recipes` ADD CONSTRAINT `user_recipes_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserRecipes` ADD CONSTRAINT `_UserRecipes_A_fkey` FOREIGN KEY (`A`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserRecipes` ADD CONSTRAINT `_UserRecipes_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RecipeIngredients` ADD CONSTRAINT `_RecipeIngredients_A_fkey` FOREIGN KEY (`A`) REFERENCES `ingredients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RecipeIngredients` ADD CONSTRAINT `_RecipeIngredients_B_fkey` FOREIGN KEY (`B`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
