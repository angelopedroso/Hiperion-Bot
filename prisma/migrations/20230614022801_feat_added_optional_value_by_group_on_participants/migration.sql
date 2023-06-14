-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_participants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "isBlacklisted" BOOLEAN NOT NULL DEFAULT false,
    "group_id" TEXT,
    CONSTRAINT "participants_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_participants" ("group_id", "id", "isBlacklisted", "tipo") SELECT "group_id", "id", "isBlacklisted", "tipo" FROM "participants";
DROP TABLE "participants";
ALTER TABLE "new_participants" RENAME TO "participants";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
