/*
  Warnings:

  - The primary key for the `recipe_ingredients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `recipe_ingredients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `recipe_ingredients` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`recipeId`, `ingredientId`);
