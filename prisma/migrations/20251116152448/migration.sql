-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "VehicleType" ADD VALUE 'Bicycle';
ALTER TYPE "VehicleType" ADD VALUE 'Boat';
ALTER TYPE "VehicleType" ADD VALUE 'Plane';

-- CreateIndex
CREATE INDEX "Vehicle_index_type_idx" ON "Vehicle_index"("type");

-- CreateIndex
CREATE INDEX "Wni_index_vehicleId_idx" ON "Wni_index"("vehicleId");
