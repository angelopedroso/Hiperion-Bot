-- CreateTable
CREATE TABLE `BotSettings` (
    `id` VARCHAR(191) NOT NULL,
    `private` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
