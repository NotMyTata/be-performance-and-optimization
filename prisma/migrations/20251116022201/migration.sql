/*
  Warnings:

  - You are about to drop the `WNI` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WNI" DROP CONSTRAINT "WNI_vehicleId_fkey";

-- DropTable
DROP TABLE "WNI";

-- CreateTable
CREATE TABLE "Wni" (
    "id" SERIAL NOT NULL,
    "nik" VARCHAR(16) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "vehicleId" INTEGER NOT NULL,

    CONSTRAINT "Wni_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Wni" ADD CONSTRAINT "Wni_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
