import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Observable } from "rxjs";

import { AgentService } from "@app/agent/providers/agent.service";
import { ChatSessionThreadEvent } from "@app/api/dto/agent.dto";
import {
  CommitChatSession,
  CreateChatSession,
  GetChatSession,
  ListChatSessionThreadEvents,
  UpdateChatSession,
} from "@app/api/dto/chat-session.dto";
import {
  ThreadErrorEvent,
  ThreadMessageContent,
  ThreadMessageContentImage,
  ThreadMessageEvent,
  ThreadTaskEvent,
} from "@app/api/dto/thread.dto";
import { CryptoService } from "@app/crypto/crypto.service";
import { DbService } from "@app/db/db.service";
import { FileService } from "@app/file/providers/file.service";
import { QuestionService } from "@app/question/providers/question.service";

@Injectable()
export class ChatSessionService {
  constructor(
    private readonly dbService: DbService,
    private readonly cryptoService: CryptoService,
    private readonly agentService: AgentService,
    private readonly questionService: QuestionService,
    private readonly fileService: FileService,
  ) {}

  async createChatSession(): Promise<CreateChatSession.Response> {
    const session = await this.dbService.Prisma.chatSession.create({
      data: {},
      select: {
        id: true,
        eventCount: true,
        messageCount: true,
        htmlQuestionContent: true,
        htmlSolutionContent: true,
        answer: true,
        selections: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return session;
  }

  async getChatSession(sessionId: string): Promise<GetChatSession.Response> {
    const session = await this.dbService.Prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        eventCount: true,
        messageCount: true,
        htmlQuestionContent: true,
        htmlSolutionContent: true,
        answer: true,
        selections: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!session) {
      throw new NotFoundException(`no chat session found with id ${sessionId}`);
    }

    return session;
  }

  async updateChatSession(
    sessionId: string,
    body: UpdateChatSession.RequestBody,
  ): Promise<UpdateChatSession.Response> {
    const session = await this.dbService.Prisma.chatSession.update({
      where: { id: sessionId },
      data: body,
      select: {
        id: true,
        eventCount: true,
        messageCount: true,
        htmlQuestionContent: true,
        htmlSolutionContent: true,
        answer: true,
        selections: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return session;
  }

  async listChatSessionThreadEvents(
    sessionId: string,
  ): Promise<ListChatSessionThreadEvents.Response> {
    const chatSession = await this.dbService.Prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: {
        events: {
          select: {
            id: true,
            order: true,
            kind: true,
            createdAt: true,
            errorMessage: true,
            taskId: true,
            taskType: true,
            taskPhase: true,
            taskError: true,
            messageSpeaker: true,
            contents: {
              select: {
                kind: true,
                encryptedText: true,
                encryptedTextIv: true,
                encryptedTextAuthTag: true,
                encryptedUrl: true,
                encryptedUrlIv: true,
                encryptedUrlAuthTag: true,
              },
              orderBy: {
                order: "asc",
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!chatSession) {
      throw new NotFoundException(`no chat session found with id ${sessionId}`);
    }

    return chatSession.events.map((event) => {
      switch (event.kind) {
        case "ERROR": {
          return {
            id: event.id,
            order: event.order,
            createdAt: event.createdAt,
            type: "error",
            error: event.errorMessage ?? "no-error-details",
          } satisfies ThreadErrorEvent;
        }

        case "TASK": {
          return {
            id: event.id,
            order: event.order,
            createdAt: event.createdAt,
            type: "task",
            taskId: event.taskId ?? "no-task-id",
            taskType: event.taskType ?? "no-task-type",
            taskPhase: event.taskPhase as "pre" | "post" | "error",
            taskError: event.taskError ?? undefined,
          } satisfies ThreadTaskEvent;
        }

        case "MESSAGE": {
          return {
            id: event.id,
            order: event.order,
            createdAt: event.createdAt,
            type: "message",
            speaker: event.messageSpeaker === "USER" ? "user" : "assistant",
            contents: event.contents
              .map((content) => {
                if (
                  content.kind === "TEXT" &&
                  content.encryptedText &&
                  content.encryptedTextIv &&
                  content.encryptedTextAuthTag
                ) {
                  const decryptedText = this.cryptoService.decrypt({
                    data: content.encryptedText,
                    iv: content.encryptedTextIv,
                    authTag: content.encryptedTextAuthTag,
                  });

                  if (!decryptedText) {
                    throw new InternalServerErrorException(
                      "failed to decrypt text",
                    );
                  }

                  return {
                    type: "text",
                    text: decryptedText.toString("utf-8"),
                  };
                } else if (
                  content.kind === "IMAGE" &&
                  content.encryptedUrl &&
                  content.encryptedUrlIv &&
                  content.encryptedUrlAuthTag
                ) {
                  const decryptedUrl = this.cryptoService.decrypt({
                    data: content.encryptedUrl,
                    iv: content.encryptedUrlIv,
                    authTag: content.encryptedUrlAuthTag,
                  });

                  if (!decryptedUrl) {
                    throw new InternalServerErrorException(
                      "failed to decrypt image url",
                    );
                  }

                  return {
                    type: "image",
                    imageUrl: decryptedUrl.toString("utf-8"),
                  } satisfies ThreadMessageContentImage;
                }

                return null;
              })
              .filter((value) => value !== null) as ThreadMessageContent[],
          } satisfies ThreadMessageEvent;
        }
      }
    });
  }

  async commitChatSession(
    sessionId: string,
    questionId?: string,
  ): Promise<CommitChatSession.Response> {
    const session = await this.dbService.Prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: {
        htmlQuestionContent: true,
        htmlSolutionContent: true,
        answer: true,
        selections: true,
      },
    });

    if (!session) {
      throw new NotFoundException(`no chat session found with id ${sessionId}`);
    }

    if (!questionId) {
      return await this.questionService.createQuestion(
        session.htmlQuestionContent,
        session.htmlSolutionContent,
        session.answer,
        session.selections.length === 0
          ? null
          : (session.selections as [string, string, string, string, string]),
        [],
        [],
      );
    } else {
      return await this.questionService.updateQuestion(
        questionId,
        session.htmlQuestionContent,
        session.htmlSolutionContent,
        session.answer,
        session.selections.length === 0
          ? null
          : (session.selections as [string, string, string, string, string]),
      );
    }
  }

  async streamResponse(
    sessionId: string,
    userMessage: string,
    userMessageImageFileIds: string[],
  ): Promise<Observable<ChatSessionThreadEvent>> {
    const imageFileUrlPairs = await Promise.all(
      userMessageImageFileIds.map((fileId) =>
        this.fileService.getImageFileUrl(fileId),
      ),
    );

    return await this.agentService.chat(
      sessionId,
      userMessage,
      imageFileUrlPairs.map(([_file, pair]) => pair.url),
    );
  }
}
