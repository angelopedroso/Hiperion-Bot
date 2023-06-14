/*
  Warnings:

  - You are about to drop the column `flood_detector` on the `groups` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_groups" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bemvindo" BOOLEAN NOT NULL,
    "link_detector" BOOLEAN NOT NULL,
    "porn_detector" BOOLEAN NOT NULL
);
INSERT INTO "new_groups" ("bemvindo", "id", "link_detector", "porn_detector") SELECT "bemvindo", "id", "link_detector", "porn_detector" FROM "groups";
DROP TABLE "groups";
ALTER TABLE "new_groups" RENAME TO "groups";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
