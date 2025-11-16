-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('Car', 'Motorcycle');

-- CreateTable
CREATE TABLE "WNI" (
    "id" SERIAL NOT NULL,
    "nik" VARCHAR(16) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "vehicleId" INTEGER NOT NULL,

    CONSTRAINT "WNI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "VehicleType" NOT NULL,
    "plate" VARCHAR(8) NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WNI" ADD CONSTRAINT "WNI_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
