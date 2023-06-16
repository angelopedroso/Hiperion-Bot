/*
  Warnings:

  - A unique constraint covering the columns `[anti_trava_id]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - Made the column `anti_trava_id` on table `Group` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Group` DROP FOREIGN KEY `Group_anti_trava_id_fkey`;

-- AlterTable
ALTER TABLE `Group` MODIFY `anti_trava_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Group_anti_trava_id_key` ON `Group`(`anti_trava_id`);

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_anti_trava_id_fkey` FOREIGN KEY (`anti_trava_id`) REFERENCES `AntiTrava`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
