/*
  Warnings:

  - Made the column `channel` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `direction` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "channel" SET NOT NULL,
ALTER COLUMN "direction" SET NOT NULL;
