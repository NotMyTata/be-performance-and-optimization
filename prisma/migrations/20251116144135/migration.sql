-- CreateTable
CREATE TABLE "Wni_index" (
    "id" SERIAL NOT NULL,
    "nik" VARCHAR(16) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "vehicleId" INTEGER NOT NULL,

    CONSTRAINT "Wni_index_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_index" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "VehicleType" NOT NULL,
    "plate" VARCHAR(8) NOT NULL,

    CONSTRAINT "Vehicle_index_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wni_index_nik_key" ON "Wni_index"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_index_plate_key" ON "Vehicle_index"("plate");

-- AddForeignKey
ALTER TABLE "Wni_index" ADD CONSTRAINT "Wni_index_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle_index"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
