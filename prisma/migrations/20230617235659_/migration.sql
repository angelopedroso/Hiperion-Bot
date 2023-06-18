/*
  Warnings:

  - Made the column `groupId` on table `ParticipantGroupType` required. This step will fail if there are existing NULL values in that column.
  - Made the column `participantId` on table `ParticipantGroupType` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `ParticipantGroupType` DROP FOREIGN KEY `ParticipantGroupType_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `ParticipantGroupType` DROP FOREIGN KEY `ParticipantGroupType_participantId_fkey`;

-- AlterTable
ALTER TABLE `ParticipantGroupType` MODIFY `groupId` VARCHAR(191) NOT NULL,
    MODIFY `participantId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ParticipantGroupType` ADD CONSTRAINT `ParticipantGroupType_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParticipantGroupType` ADD CONSTRAINT `ParticipantGroupType_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `Participant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
