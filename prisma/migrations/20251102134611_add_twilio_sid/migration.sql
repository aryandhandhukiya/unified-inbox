/*
  Warnings:

  - A unique constraint covering the columns `[twilioSid]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "twilioSid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Message_twilioSid_key" ON "Message"("twilioSid");
