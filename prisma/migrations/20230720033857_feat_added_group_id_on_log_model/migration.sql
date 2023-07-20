/*
  Warnings:

  - Added the required column `groupId` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Log` ADD COLUMN `groupId` VARCHAR(191) NOT NULL;
