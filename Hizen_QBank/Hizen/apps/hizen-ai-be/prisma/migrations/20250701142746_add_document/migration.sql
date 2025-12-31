-- CreateEnum
CREATE TYPE "DocumentSectionContentType" AS ENUM ('TEXT', 'IMAGE');

-- CreateTable
CREATE TABLE "Subject" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subjectId" UUID,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentSection" (
    "id" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "documentId" UUID NOT NULL,

    CONSTRAINT "DocumentSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentSectionContent" (
    "id" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "type" "DocumentSectionContentType" NOT NULL,
    "text" TEXT,
    "imageUrl" TEXT,
    "sectionId" UUID NOT NULL,

    CONSTRAINT "DocumentSectionContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentSection_documentId_order_key" ON "DocumentSection"("documentId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentSectionContent_sectionId_order_key" ON "DocumentSectionContent"("sectionId", "order");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentSection" ADD CONSTRAINT "DocumentSection_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentSectionContent" ADD CONSTRAINT "DocumentSectionContent_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "DocumentSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
