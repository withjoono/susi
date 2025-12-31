import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import * as crypto from "crypto";
import { Prisma } from "prisma/prisma-generated";

import {
  IChatAssistantMessage,
  IChatMessage,
  IChatMessageImageContent,
  IChatMessageTextContent,
  IChatToolMessage,
  IChatUserMessage,
} from "@app/agent/structures/IChatMessage";
import {
  ChatSessionErrorEvent,
  ChatSessionGenerateQuestionTaskEvent,
  ChatSessionProcessingTaskEvent,
  ChatSessionReadQuestionTaskEvent,
} from "@app/api/dto/agent.dto";
import {
  ThreadMessageContentImage,
  ThreadMessageContentText,
  ThreadMessageEvent,
} from "@app/api/dto/thread.dto";
import { CryptoService } from "@app/crypto/crypto.service";
import { DbService } from "@app/db/db.service";
import { GlobalConfig } from "@app/global/global";

@Injectable()
export class AgentContextService {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly dbService: DbService,
  ) {}

  async getOpenAiApiKey(): Promise<string> {
    return GlobalConfig.Instance.OpenAiApiKey;
  }

  async getThreadContext(sessionId: string): Promise<IChatMessage[]> {
    const messages =
      await this.dbService.Prisma.chatSessionThreadMessage.findMany({
        where: {
          sessionId,
        },
        select: {
          id: true,
          speaker: true,
          toolCallId: true,
          toolName: true,
          createdAt: true,
          contents: {
            select: {
              text: {
                select: {
                  encryptedText: true,
                  encryptedTextIv: true,
                  encryptedTextAuthTag: true,
                },
              },
              image: {
                select: {
                  encryptedUrl: true,
                  encryptedUrlIv: true,
                  encryptedUrlAuthTag: true,
                },
              },
              toolCall: {
                select: {
                  toolCallId: true,
                  toolName: true,
                  encryptedArguments: true,
                  encryptedArgumentsIv: true,
                  encryptedArgumentsAuthTag: true,
                },
              },
            },
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      });

    function extractAllSatisfiedTooCallIds(
      allMessages: typeof messages,
    ): Set<string> {
      const toolResultIds: Set<string> = new Set();

      for (const message of allMessages) {
        if (message.speaker !== "TOOL") {
          continue;
        }

        if (!message.toolCallId) {
          continue;
        }

        toolResultIds.add(message.toolCallId);
      }

      return toolResultIds;
    }

    function toChatMessage(
      cryptoService: CryptoService,
      message: (typeof messages)[number],
      satisfiedToolCallIds: Set<string>,
    ): IChatMessage[] {
      switch (message.speaker) {
        case "USER": {
          const contents: IChatUserMessage["contents"] = [];

          for (const content of message.contents) {
            if (content.text) {
              const decryptedText = cryptoService.decrypt({
                data: content.text.encryptedText,
                iv: content.text.encryptedTextIv,
                authTag: content.text.encryptedTextAuthTag,
              });

              if (!decryptedText) {
                throw new InternalServerErrorException(
                  "failed to decrypt text",
                );
              }

              contents.push({
                type: "text",
                text: decryptedText.toString("utf8"),
              });
            }

            if (content.image) {
              const decryptedUrl = cryptoService.decrypt({
                data: content.image.encryptedUrl,
                iv: content.image.encryptedUrlIv,
                authTag: content.image.encryptedUrlAuthTag,
              });

              if (!decryptedUrl) {
                throw new InternalServerErrorException(
                  "failed to decrypt image url",
                );
              }

              contents.push({
                type: "image",
                image_url: decryptedUrl.toString("utf8"),
              });
            }
          }

          return [
            {
              id: message.id,
              role: "user",
              timestamp: message.createdAt,
              contents,
            },
          ];
        }
        case "AI": {
          const contents: IChatAssistantMessage["contents"] = [];
          const unsatisfiedToolMessages: IChatToolMessage[] = [];

          for (const content of message.contents) {
            if (content.text) {
              const decryptedText = cryptoService.decrypt({
                data: content.text.encryptedText,
                iv: content.text.encryptedTextIv,
                authTag: content.text.encryptedTextAuthTag,
              });

              if (!decryptedText) {
                throw new InternalServerErrorException(
                  "failed to decrypt text",
                );
              }

              contents.push({
                type: "text",
                text: decryptedText.toString("utf8"),
              });
            }

            if (content.toolCall) {
              const decryptedArguments = cryptoService.decrypt({
                data: content.toolCall.encryptedArguments,
                iv: content.toolCall.encryptedArgumentsIv,
                authTag: content.toolCall.encryptedArgumentsAuthTag,
              });

              if (!decryptedArguments) {
                throw new InternalServerErrorException(
                  "failed to decrypt arguments",
                );
              }

              contents.push({
                type: "tool",
                id: content.toolCall.toolCallId,
                tool_name: content.toolCall.toolName,
                arguments: decryptedArguments.toString("utf8"),
              });

              if (!satisfiedToolCallIds.has(content.toolCall.toolCallId)) {
                unsatisfiedToolMessages.push({
                  id: crypto.randomUUID(),
                  role: "tool",
                  timestamp: new Date(),
                  tool_call_id: content.toolCall.toolCallId,
                  tool_name: content.toolCall.toolName,
                  contents: [
                    {
                      type: "text",
                      text: "[FAILURE] the tool did not respond; no result is emitted",
                    },
                  ],
                });
              }
            }
          }

          const messages: IChatMessage[] = [
            {
              id: message.id,
              role: "assistant",
              timestamp: message.createdAt,
              contents,
            },
            ...unsatisfiedToolMessages,
          ];

          return messages;
        }
        case "TOOL": {
          if (!message.toolCallId || !message.toolName) {
            throw new InternalServerErrorException(
              "toolCallId and toolName are required if speaker is TOOL",
            );
          }

          const contents: IChatToolMessage["contents"] = [];

          for (const content of message.contents) {
            if (content.text) {
              const decryptedText = cryptoService.decrypt({
                data: content.text.encryptedText,
                iv: content.text.encryptedTextIv,
                authTag: content.text.encryptedTextAuthTag,
              });

              if (!decryptedText) {
                throw new InternalServerErrorException(
                  "failed to decrypt text",
                );
              }

              contents.push({
                type: "text",
                text: decryptedText.toString("utf8"),
              });
            }
          }

          return [
            {
              id: message.id,
              role: "tool",
              timestamp: message.createdAt,
              tool_call_id: message.toolCallId,
              tool_name: message.toolName,
              contents,
            },
          ];
        }
        default: {
          throw new InternalServerErrorException(
            `invalid speaker: ${message.speaker}`,
          );
        }
      }
    }

    const satisfiedToolCallIds = extractAllSatisfiedTooCallIds(messages);

    return messages.flatMap((message) =>
      toChatMessage(this.cryptoService, message, satisfiedToolCallIds),
    );
  }

  async createThreadEvent(
    sessionId: string,
    event:
      | ChatSessionErrorEvent
      | ChatSessionProcessingTaskEvent
      | ChatSessionReadQuestionTaskEvent
      | ChatSessionGenerateQuestionTaskEvent,
  ): Promise<void> {
    await this.dbService.Prisma.$transaction(async (tx) => {
      const session = await this.dbService.Prisma.chatSession.findUnique({
        where: {
          id: sessionId,
        },
        select: {
          eventCount: true,
        },
      });

      if (!session) {
        throw new NotFoundException(`session not found with id ${sessionId}`);
      }

      const order = session.eventCount;
      let data: Prisma.ChatSessionThreadEventCreateInput;

      switch (event.type) {
        case "error":
          {
            data = {
              session: {
                connect: {
                  id: sessionId,
                },
              },
              order,
              kind: "ERROR",
              errorMessage: String(event.error),
            };
          }
          break;
        case "task": {
          data = {
            session: {
              connect: {
                id: sessionId,
              },
            },
            order,
            kind: "TASK",
            taskId: event.id,
            taskType: event.taskType,
            taskPhase: event.phase,
            taskError: event.error ? String(event.error) : undefined,
          };
          break;
        }
        default:
          return;
      }

      await Promise.all([
        tx.chatSessionThreadEvent.create({
          data,
          select: {
            id: true,
          },
        }),
        tx.chatSession.update({
          where: {
            id: sessionId,
          },
          data: {
            eventCount: {
              increment: 1,
            },
          },
          select: {
            id: true,
          },
        }),
      ]);
    });
  }

  async createThreadEventMessage(
    sessionId: string,
    role: "user" | "assistant",
    contents: (IChatMessageTextContent | IChatMessageImageContent)[],
  ): Promise<ThreadMessageEvent> {
    return await this.dbService.Prisma.$transaction(async (tx) => {
      const session = await tx.chatSession.findUnique({
        where: {
          id: sessionId,
        },
        select: {
          eventCount: true,
        },
      });

      if (!session) {
        throw new NotFoundException(`session not found with id ${sessionId}`);
      }

      const order = session.eventCount;
      const [threadEvent] = await Promise.all([
        tx.chatSessionThreadEvent.create({
          data: {
            session: {
              connect: {
                id: sessionId,
              },
            },
            order,
            kind: "MESSAGE",
            messageSpeaker: role === "user" ? "USER" : "AI",
          },
          select: {
            id: true,
          },
        }),
        tx.chatSession.update({
          where: {
            id: sessionId,
          },
          data: {
            eventCount: {
              increment: 1,
            },
          },
          select: {
            id: true,
          },
        }),
      ]);

      const tasks: Promise<unknown>[] = [];

      for (let index = 0; index < contents.length; ++index) {
        let data: Prisma.ChatSessionThreadEventMessageContentCreateInput;
        const content = contents[index];

        switch (content.type) {
          case "text": {
            {
              const encrypted = this.cryptoService.encrypt(content.text);
              data = {
                event: {
                  connect: {
                    id: threadEvent.id,
                  },
                },
                order: index,
                kind: "TEXT",
                encryptedText: encrypted.data,
                encryptedTextIv: encrypted.iv,
                encryptedTextAuthTag: encrypted.authTag,
              };
            }
            break;
          }
          case "image": {
            {
              const encrypted = this.cryptoService.encrypt(content.image_url);
              data = {
                event: {
                  connect: {
                    id: threadEvent.id,
                  },
                },
                order: index,
                kind: "IMAGE",
                encryptedUrl: encrypted.data,
                encryptedUrlIv: encrypted.iv,
                encryptedUrlAuthTag: encrypted.authTag,
              };
            }
            break;
          }
        }

        tasks.push(
          tx.chatSessionThreadEventMessageContent.create({
            data,
            select: {
              id: true,
            },
          }),
        );
      }

      await Promise.all(tasks);

      return {
        id: threadEvent.id,
        order,
        createdAt: new Date(),
        type: "message",
        speaker: role === "user" ? "user" : "assistant",
        contents: contents.map((content) => {
          if (content.type === "text") {
            return {
              type: "text",
              text: content.text,
            } satisfies ThreadMessageContentText;
          } else {
            return {
              type: "image",
              imageUrl: content.image_url,
            } satisfies ThreadMessageContentImage;
          }
        }),
      } satisfies ThreadMessageEvent;
    });
  }

  async createThreadMessage(
    sessionId: string,
    message: IChatMessage,
  ): Promise<void> {
    await this.dbService.Prisma.$transaction(async (tx) => {
      const session = await tx.chatSession.findUnique({
        where: {
          id: sessionId,
        },
        select: {
          messageCount: true,
        },
      });

      if (!session) {
        throw new NotFoundException(`session not found with id ${sessionId}`);
      }

      const order = session.messageCount;
      const [threadMessage] = await Promise.all([
        tx.chatSessionThreadMessage.create({
          data: {
            session: {
              connect: {
                id: sessionId,
              },
            },
            order,
            speaker:
              message.role === "user"
                ? "USER"
                : message.role === "assistant"
                  ? "AI"
                  : "TOOL",
            messageId: message.id,
            toolCallId:
              message.role === "tool" ? message.tool_call_id : undefined,
            toolName: message.role === "tool" ? message.tool_name : undefined,
          },
          select: {
            id: true,
          },
        }),
        tx.chatSession.update({
          where: {
            id: sessionId,
          },
          data: {
            messageCount: {
              increment: 1,
            },
          },
          select: {
            id: true,
          },
        }),
      ]);

      const tasks: Promise<unknown>[] = [];

      for (let index = 0; index < message.contents.length; ++index) {
        const content = message.contents[index];
        let data: Prisma.ChatSessionThreadMessageContentCreateInput;

        switch (content.type) {
          case "text": {
            {
              const encrypted = this.cryptoService.encrypt(content.text);
              data = {
                message: {
                  connect: {
                    id: threadMessage.id,
                  },
                },
                order: index,
                type: "TEXT",
                text: {
                  create: {
                    encryptedText: encrypted.data,
                    encryptedTextIv: encrypted.iv,
                    encryptedTextAuthTag: encrypted.authTag,
                  },
                },
              };
            }
            break;
          }
          case "image": {
            {
              const encrypted = this.cryptoService.encrypt(content.image_url);
              data = {
                message: {
                  connect: {
                    id: threadMessage.id,
                  },
                },
                order: index,
                type: "IMAGE",
                image: {
                  create: {
                    encryptedUrl: encrypted.data,
                    encryptedUrlIv: encrypted.iv,
                    encryptedUrlAuthTag: encrypted.authTag,
                  },
                },
              };
            }
            break;
          }
          case "tool": {
            {
              const encrypted = this.cryptoService.encrypt(content.arguments);
              data = {
                message: {
                  connect: {
                    id: threadMessage.id,
                  },
                },
                order: index,
                type: "TOOL_CALL",
                toolCall: {
                  create: {
                    toolCallId: content.id,
                    toolName: content.tool_name,
                    encryptedArguments: encrypted.data,
                    encryptedArgumentsIv: encrypted.iv,
                    encryptedArgumentsAuthTag: encrypted.authTag,
                  },
                },
              };
            }
            break;
          }
        }

        tasks.push(
          tx.chatSessionThreadMessageContent.create({
            data,
            select: {
              id: true,
            },
          }),
        );
      }

      await Promise.all(tasks);
    });
  }
}
