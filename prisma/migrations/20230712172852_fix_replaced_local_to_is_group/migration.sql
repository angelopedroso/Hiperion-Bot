/*
  Warnings:

  - You are about to drop the column `chatName` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `dateTime` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `local` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Log` table. All the data in the column will be lost.
  - Added the required column `is_group` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Log` DROP COLUMN `chatName`,
    DROP COLUMN `dateTime`,
    DROP COLUMN `local`,
    DROP COLUMN `userName`,
    ADD COLUMN `chat_name` VARCHAR(191) NULL,
    ADD COLUMN `date_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `is_group` BOOLEAN NOT NULL,
    ADD COLUMN `user_name` VARCHAR(191) NOT NULL;
