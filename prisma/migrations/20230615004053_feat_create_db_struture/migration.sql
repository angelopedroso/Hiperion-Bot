-- CreateTable
CREATE TABLE `Participant` (
    `id` VARCHAR(191) NOT NULL,
    `tipo` ENUM('admin', 'membro') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Group` (
    `id` VARCHAR(191) NOT NULL,
    `bem_vindo` BOOLEAN NULL DEFAULT false,
    `anti_link` BOOLEAN NULL DEFAULT false,
    `anti_porn` BOOLEAN NULL DEFAULT false,
    `anti_trava_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AntiTrava` (
    `id` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NULL DEFAULT false,
    `max_characters` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_participants_group` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_participants_group_AB_unique`(`A`, `B`),
    INDEX `_participants_group_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_participant_black_list` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_participant_black_list_AB_unique`(`A`, `B`),
    INDEX `_participant_black_list_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_anti_trava_id_fkey` FOREIGN KEY (`anti_trava_id`) REFERENCES `AntiTrava`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_participants_group` ADD CONSTRAINT `_participants_group_A_fkey` FOREIGN KEY (`A`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_participants_group` ADD CONSTRAINT `_participants_group_B_fkey` FOREIGN KEY (`B`) REFERENCES `Participant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_participant_black_list` ADD CONSTRAINT `_participant_black_list_A_fkey` FOREIGN KEY (`A`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_participant_black_list` ADD CONSTRAINT `_participant_black_list_B_fkey` FOREIGN KEY (`B`) REFERENCES `Participant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
