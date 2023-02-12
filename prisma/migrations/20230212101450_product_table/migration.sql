-- CreateTable
CREATE TABLE `Products` (
    `id` VARCHAR(191) NOT NULL,
    `product_name` VARCHAR(191) NOT NULL,
    `product_des` VARCHAR(191) NOT NULL,
    `product_img` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NULL,
    `amount` VARCHAR(191) NOT NULL,
    `discount` VARCHAR(191) NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastEdited` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Products_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
