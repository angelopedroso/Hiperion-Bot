/*
  Warnings:

  - Added the required column `name` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Participant` ADD COLUMN `image_url` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
