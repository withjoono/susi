/*
  Warnings:

  - You are about to drop the column `description` on the `QuestionImage` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `QuestionImage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[questionId,fileId]` on the table `QuestionImage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileId` to the `QuestionImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuestionImage" DROP COLUMN "description",
DROP COLUMN "url",
ADD COLUMN     "fileId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "QuestionImage_questionId_fileId_key" ON "QuestionImage"("questionId", "fileId");

-- AddForeignKey
ALTER TABLE "QuestionImage" ADD CONSTRAINT "QuestionImage_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "UploadedFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
