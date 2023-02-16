/*
  Warnings:

  - You are about to alter the column `status` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `amount` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `discount` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `qty` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `status` INTEGER NOT NULL,
    MODIFY `amount` INTEGER NOT NULL,
    MODIFY `discount` INTEGER NULL,
    MODIFY `qty` INTEGER NOT NULL;
