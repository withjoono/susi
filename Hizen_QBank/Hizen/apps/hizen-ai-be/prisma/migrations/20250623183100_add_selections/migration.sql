-- AlterTable
ALTER TABLE "ChatSession" ADD COLUMN     "selections" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "selections" TEXT[] DEFAULT ARRAY[]::TEXT[];
