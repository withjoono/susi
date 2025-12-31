-- CreateTable
CREATE TABLE "Question" (
    "id" UUID NOT NULL,
    "htmlQuestionContent" TEXT NOT NULL,
    "htmlSolutionContent" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionImage" (
    "id" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "QuestionImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionLabel" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionLabelPair" (
    "questionId" UUID NOT NULL,
    "labelId" UUID NOT NULL,

    CONSTRAINT "QuestionLabelPair_pkey" PRIMARY KEY ("questionId","labelId")
);

-- AddForeignKey
ALTER TABLE "QuestionImage" ADD CONSTRAINT "QuestionImage_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionLabelPair" ADD CONSTRAINT "QuestionLabelPair_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionLabelPair" ADD CONSTRAINT "QuestionLabelPair_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "QuestionLabel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
