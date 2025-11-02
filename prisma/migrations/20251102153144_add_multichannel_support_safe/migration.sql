/*
  Warnings:

  - The `channel` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `direction` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[email]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[telegramId]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discordId]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('whatsapp', 'sms', 'email', 'telegram', 'discord');

-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('inbound', 'outbound');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('SENT', 'DELIVERED', 'READ', 'FAILED');

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "discordId" TEXT,
ADD COLUMN     "telegramId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "channel",
ADD COLUMN     "channel" "Channel",
DROP COLUMN "direction",
ADD COLUMN     "direction" "Direction",
DROP COLUMN "status",
ADD COLUMN     "status" "MessageStatus" NOT NULL DEFAULT 'SENT';

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_telegramId_key" ON "Contact"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_discordId_key" ON "Contact"("discordId");
