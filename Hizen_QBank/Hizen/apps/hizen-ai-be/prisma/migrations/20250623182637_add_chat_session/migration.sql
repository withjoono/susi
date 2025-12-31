-- CreateEnum
CREATE TYPE "ChatSessionThreadEventKind" AS ENUM ('ERROR', 'TASK', 'MESSAGE');

-- CreateEnum
CREATE TYPE "ChatSessionThreadEventTaskPhase" AS ENUM ('PRE', 'POST', 'ERROR');

-- CreateEnum
CREATE TYPE "ChatSessionThreadEventMessageSpeaker" AS ENUM ('USER', 'AI');

-- CreateEnum
CREATE TYPE "ChatSessionThreadEventMessageContentKind" AS ENUM ('TEXT', 'IMAGE');

-- CreateEnum
CREATE TYPE "ChatSessionThreadMessageSpeaker" AS ENUM ('USER', 'AI', 'TOOL');

-- CreateEnum
CREATE TYPE "ChatSessionThreadMessageContentType" AS ENUM ('TEXT', 'IMAGE', 'TOOL_CALL');

-- CreateTable
CREATE TABLE "ChatSession" (
    "id" UUID NOT NULL,
    "htmlQuestionContent" TEXT NOT NULL DEFAULT '',
    "htmlSolutionContent" TEXT NOT NULL DEFAULT '',
    "answer" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSessionThreadEvent" (
    "id" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "kind" "ChatSessionThreadEventKind" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "errorMessage" TEXT,
    "taskId" TEXT,
    "taskType" TEXT,
    "taskPhase" TEXT,
    "taskError" TEXT,
    "messageSpeaker" "ChatSessionThreadEventMessageSpeaker",
    "sessionId" UUID NOT NULL,

    CONSTRAINT "ChatSessionThreadEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSessionThreadEventMessageContent" (
    "id" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "kind" "ChatSessionThreadEventMessageContentKind" NOT NULL,
    "encryptedText" TEXT,
    "encryptedTextIv" TEXT,
    "encryptedTextAuthTag" TEXT,
    "encryptedUrl" TEXT,
    "encryptedUrlIv" TEXT,
    "encryptedUrlAuthTag" TEXT,
    "eventId" UUID NOT NULL,

    CONSTRAINT "ChatSessionThreadEventMessageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSessionThreadMessage" (
    "id" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "speaker" "ChatSessionThreadMessageSpeaker" NOT NULL,
    "messageId" TEXT NOT NULL,
    "toolCallId" TEXT,
    "toolName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" UUID NOT NULL,

    CONSTRAINT "ChatSessionThreadMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSessionThreadMessageContent" (
    "id" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "type" "ChatSessionThreadMessageContentType" NOT NULL,
    "messageId" UUID NOT NULL,

    CONSTRAINT "ChatSessionThreadMessageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSessionThreadMessageContentText" (
    "id" UUID NOT NULL,
    "encryptedText" TEXT NOT NULL,
    "encryptedTextIv" TEXT NOT NULL,
    "encryptedTextAuthTag" TEXT NOT NULL,
    "contentId" UUID NOT NULL,

    CONSTRAINT "ChatSessionThreadMessageContentText_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSessionThreadMessageContentImage" (
    "id" UUID NOT NULL,
    "encryptedUrl" TEXT NOT NULL,
    "encryptedUrlIv" TEXT NOT NULL,
    "encryptedUrlAuthTag" TEXT NOT NULL,
    "contentId" UUID NOT NULL,

    CONSTRAINT "ChatSessionThreadMessageContentImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSessionThreadMessageContentToolCall" (
    "id" UUID NOT NULL,
    "toolCallId" TEXT NOT NULL,
    "toolName" TEXT NOT NULL,
    "encryptedArguments" TEXT NOT NULL,
    "encryptedArgumentsIv" TEXT NOT NULL,
    "encryptedArgumentsAuthTag" TEXT NOT NULL,
    "contentId" UUID NOT NULL,

    CONSTRAINT "ChatSessionThreadMessageContentToolCall_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatSessionThreadEvent_sessionId_order_key" ON "ChatSessionThreadEvent"("sessionId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ChatSessionThreadEventMessageContent_eventId_order_key" ON "ChatSessionThreadEventMessageContent"("eventId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ChatSessionThreadMessage_messageId_key" ON "ChatSessionThreadMessage"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatSessionThreadMessageContent_messageId_order_key" ON "ChatSessionThreadMessageContent"("messageId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ChatSessionThreadMessageContentText_contentId_key" ON "ChatSessionThreadMessageContentText"("contentId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatSessionThreadMessageContentImage_contentId_key" ON "ChatSessionThreadMessageContentImage"("contentId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatSessionThreadMessageContentToolCall_contentId_key" ON "ChatSessionThreadMessageContentToolCall"("contentId");

-- AddForeignKey
ALTER TABLE "ChatSessionThreadEvent" ADD CONSTRAINT "ChatSessionThreadEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSessionThreadEventMessageContent" ADD CONSTRAINT "ChatSessionThreadEventMessageContent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "ChatSessionThreadEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSessionThreadMessage" ADD CONSTRAINT "ChatSessionThreadMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSessionThreadMessageContent" ADD CONSTRAINT "ChatSessionThreadMessageContent_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ChatSessionThreadMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSessionThreadMessageContentText" ADD CONSTRAINT "ChatSessionThreadMessageContentText_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "ChatSessionThreadMessageContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSessionThreadMessageContentImage" ADD CONSTRAINT "ChatSessionThreadMessageContentImage_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "ChatSessionThreadMessageContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSessionThreadMessageContentToolCall" ADD CONSTRAINT "ChatSessionThreadMessageContentToolCall_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "ChatSessionThreadMessageContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
