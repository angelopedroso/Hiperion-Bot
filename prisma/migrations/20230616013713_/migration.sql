-- DropForeignKey
ALTER TABLE `Group` DROP FOREIGN KEY `Group_anti_trava_id_fkey`;

-- AlterTable
ALTER TABLE `Group` MODIFY `anti_trava_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_anti_trava_id_fkey` FOREIGN KEY (`anti_trava_id`) REFERENCES `AntiTrava`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
