-- CreateTable
CREATE TABLE `Log` (
    `id` VARCHAR(191) NOT NULL,
    `local` ENUM('group', 'private') NOT NULL,
    `command` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `chatName` VARCHAR(191) NULL,
    `dateTime` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
