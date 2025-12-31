-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "sectionCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "DocumentSection" ADD COLUMN     "contentCount" INTEGER NOT NULL DEFAULT 0;
