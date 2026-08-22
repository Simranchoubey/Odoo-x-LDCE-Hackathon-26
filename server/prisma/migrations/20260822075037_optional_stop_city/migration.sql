-- DropForeignKey
ALTER TABLE "Stop" DROP CONSTRAINT "Stop_cityId_fkey";

-- AlterTable
ALTER TABLE "Stop" ALTER COLUMN "cityId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Stop" ADD CONSTRAINT "Stop_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;
