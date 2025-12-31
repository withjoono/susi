/*
  Warnings:

  - Made the column `url` on table `UploadedFile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UploadedFile" ALTER COLUMN "url" SET NOT NULL;
