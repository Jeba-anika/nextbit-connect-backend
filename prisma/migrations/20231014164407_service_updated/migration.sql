-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "availability" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "address" DROP DEFAULT,
ALTER COLUMN "district" DROP NOT NULL,
ALTER COLUMN "district" DROP DEFAULT;
