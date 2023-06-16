/*
  Warnings:

  - Added the required column `g_id` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `p_id` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Group` ADD COLUMN `g_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Participant` ADD COLUMN `p_id` VARCHAR(191) NOT NULL;
