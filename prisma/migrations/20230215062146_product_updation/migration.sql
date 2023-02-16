/*
  Warnings:

  - Added the required column `qty` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `qty` VARCHAR(191) NOT NULL;
