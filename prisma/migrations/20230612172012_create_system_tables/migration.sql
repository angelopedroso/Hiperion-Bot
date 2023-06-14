-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bemvindo" BOOLEAN NOT NULL,
    "link_detector" BOOLEAN NOT NULL,
    "flood_detector" BOOLEAN NOT NULL,
    "porn_detector" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    CONSTRAINT "participants_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "trava_detector" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" BOOLEAN NOT NULL,
    "max_characters" INTEGER NOT NULL,
    "group_id" TEXT NOT NULL,
    CONSTRAINT "trava_detector_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "participant_black_list" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participanteId" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    CONSTRAINT "participant_black_list_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "participants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "participant_black_list_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "trava_detector_group_id_key" ON "trava_detector"("group_id");
