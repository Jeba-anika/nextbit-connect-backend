/*
  Warnings:

  - Added the required column `address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactNo` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "contactNo" TEXT NOT NULL,
ADD COLUMN     "district" "Districts" NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL;
