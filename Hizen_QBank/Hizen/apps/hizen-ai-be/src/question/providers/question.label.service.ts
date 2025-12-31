import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "prisma/prisma-generated/runtime/library";

import { QuestionLabel } from "@app/api/dto";
import { DbService } from "@app/db/db.service";

@Injectable()
export class QuestionLabelService {
  constructor(private readonly dbService: DbService) {}

  async listQuestionLabels(): Promise<QuestionLabel[]> {
    return await this.dbService.Prisma.questionLabel.findMany({
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc",
        createdAt: "asc",
      },
    });
  }

  async createQuestionLabel(
    name: string,
    content: string,
  ): Promise<QuestionLabel> {
    return await this.dbService.Prisma.questionLabel.create({
      data: { name, content },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateQuestionLabel(
    id: string,
    name?: string,
    content?: string,
  ): Promise<QuestionLabel> {
    try {
      return await this.dbService.Prisma.questionLabel.update({
        where: { id },
        data: {
          name,
          content,
        },
        select: {
          id: true,
          name: true,
          content: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (
          error.code === "P2025" &&
          error.meta?.["modelName"] === "QuestionLabel"
        ) {
          throw new NotFoundException(`no question label found with id ${id}`);
        }
      }

      throw error;
    }
  }

  async deleteQuestionLabel(id: string): Promise<void> {
    try {
      await this.dbService.Prisma.questionLabel.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (
          error.code === "P2025" &&
          error.meta?.["modelName"] === "QuestionLabel"
        ) {
          throw new NotFoundException(`no question label found with id ${id}`);
        }
      }

      throw error;
    }
  }
}
