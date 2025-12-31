import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "prisma/prisma-generated";

import { IChatMemory } from "@app/agent/agents/ChatAgent/chat-memory";
import { DbService } from "@app/db/db.service";

@Injectable()
export class AgentMemoryService {
  constructor(private readonly dbService: DbService) {}

  async read(sessionId: string): Promise<IChatMemory> {
    const { htmlQuestionContent, htmlSolutionContent, answer, selections } =
      await this.dbService.Prisma.$transaction(async (tx) => {
        const session = await tx.chatSession.findUnique({
          where: {
            id: sessionId,
          },
          select: {
            htmlQuestionContent: true,
            htmlSolutionContent: true,
            answer: true,
            selections: true,
          },
        });

        if (!session) {
          throw new NotFoundException(`no session found with id ${sessionId}`);
        }

        return {
          htmlQuestionContent: session.htmlQuestionContent,
          htmlSolutionContent: session.htmlSolutionContent,
          answer: session.answer,
          selections: session.selections,
        };
      });

    return {
      questionPrompt: htmlQuestionContent,
      questionSelections:
        selections.length === 0
          ? undefined
          : (selections as [string, string, string, string, string]),
      answer,
      solution: htmlSolutionContent,
    };
  }

  async write(
    sessionId: string,
    htmlQuestionContent: string,
    htmlSolutionContent: string,
    answer: string,
    selections: [string, string, string, string, string] | null,
  ): Promise<void> {
    await this.dbService.Prisma.$transaction(async (tx) => {
      try {
        await tx.chatSession.update({
          where: {
            id: sessionId,
          },
          data: {
            htmlQuestionContent,
            htmlSolutionContent,
            answer,
            selections: selections === null ? [] : selections,
          },
        });
      } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new NotFoundException(
              `no session found with id ${sessionId}`,
            );
          }
        }

        throw error;
      }
    });
  }
}
