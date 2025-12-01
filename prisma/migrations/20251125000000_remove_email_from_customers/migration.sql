-- CreateEnum
CREATE TYPE "CustomerRestaurantStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "email";