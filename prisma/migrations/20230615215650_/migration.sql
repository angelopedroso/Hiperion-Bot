/*
  Warnings:

  - A unique constraint covering the columns `[g_id]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[p_id]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Group_g_id_key` ON `Group`(`g_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Participant_p_id_key` ON `Participant`(`p_id`);
