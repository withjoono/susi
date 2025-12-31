-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "parentId" UUID;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
