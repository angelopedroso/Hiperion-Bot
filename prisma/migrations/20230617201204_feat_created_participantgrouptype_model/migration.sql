/*
  Warnings:

  - You are about to drop the column `tipo` on the `Participant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Participant` DROP COLUMN `tipo`;

-- CreateTable
CREATE TABLE `ParticipantGroupType` (
    `id` VARCHAR(191) NOT NULL,
    `tipo` ENUM('admin', 'membro') NULL,
    `groupId` VARCHAR(191) NULL,
    `participantId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ParticipantGroupType` ADD CONSTRAINT `ParticipantGroupType_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParticipantGroupType` ADD CONSTRAINT `ParticipantGroupType_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `Participant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
