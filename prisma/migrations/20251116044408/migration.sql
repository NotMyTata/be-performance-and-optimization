/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `Wni` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Wni_nik_key" ON "Wni"("nik");
