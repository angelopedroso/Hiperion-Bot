-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_trava_detector" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" BOOLEAN DEFAULT false,
    "max_characters" INTEGER DEFAULT 0,
    "group_id" TEXT NOT NULL,
    CONSTRAINT "trava_detector_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_trava_detector" ("group_id", "id", "max_characters", "status") SELECT "group_id", "id", "max_characters", "status" FROM "trava_detector";
DROP TABLE "trava_detector";
ALTER TABLE "new_trava_detector" RENAME TO "trava_detector";
CREATE UNIQUE INDEX "trava_detector_group_id_key" ON "trava_detector"("group_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
