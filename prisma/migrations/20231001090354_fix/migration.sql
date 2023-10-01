/*
  Warnings:

  - You are about to drop the column `image` on the `Books` table. All the data in the column will be lost.
  - The primary key for the `Categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `Categories` table. All the data in the column will be lost.
  - The primary key for the `OrderItems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `orderId` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Books` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Books" DROP CONSTRAINT "Books_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_orderId_fkey";

-- AlterTable
ALTER TABLE "Books" DROP COLUMN "image",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_pkey",
DROP COLUMN "categoryId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_pkey",
DROP COLUMN "orderId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Orders_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image";

-- AddForeignKey
ALTER TABLE "Books" ADD CONSTRAINT "Books_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
