import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "prisma/prisma-generated";
import { PrismaClientKnownRequestError } from "prisma/prisma-generated/runtime/library";

import {
  Question,
  QuestionCursor,
  QuestionFilter,
  QuestionImage,
  QuestionLabel,
} from "@app/api/dto";
import { DbService } from "@app/db/db.service";
import { FileService } from "@app/file/providers/file.service";

@Injectable()
export class QuestionService {
  constructor(
    private readonly dbService: DbService,
    private readonly fileService: FileService,
  ) {}

  async listQuestions(
    pageSize: number,
    filter: QuestionFilter | undefined,
    cursor: QuestionCursor | undefined,
  ): Promise<Question[]> {
    const where: Prisma.QuestionWhereInput = {};

    if (filter?.labelIds.length) {
      where.labelPairs = {
        some: {
          labelId: {
            in: filter.labelIds,
          },
        },
      };
    }

    if (cursor) {
      where.createdAt = {
        gte: cursor.lastQuestionCreatedAt,
      };
      where.id = {
        gt: cursor.lastQuestionId,
      };
    }

    const questions = await this.dbService.Prisma.question.findMany({
      where,
      select: {
        id: true,
        htmlQuestionContent: true,
        htmlSolutionContent: true,
        answer: true,
        selections: true,
        createdAt: true,
        updatedAt: true,
        images: true,
        labelPairs: {
          select: {
            label: true,
          },
        },
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      take: pageSize,
    });

    return await Promise.all(
      questions.map(async (question) => {
        const questionImages = await Promise.all(
          question.images.map(async (image) => {
            const [file, fileDownloadUrl] =
              await this.fileService.getImageFileUrl(image.fileId);

            return {
              id: image.id,
              file,
              fileDownloadUrl,
            };
          }),
        );

        return {
          id: question.id,
          htmlQuestionContent: question.htmlQuestionContent,
          htmlSolutionContent: question.htmlSolutionContent,
          answer: question.answer,
          selections:
            question.selections.length === 0
              ? undefined
              : (question.selections as [
                  string,
                  string,
                  string,
                  string,
                  string,
                ]),
          createdAt: question.createdAt,
          updatedAt: question.updatedAt,
          images: questionImages,
          labels: question.labelPairs.map((pair) => pair.label),
        };
      }),
    );
  }

  async getQuestion(questionId: string): Promise<Question> {
    const question = await this.dbService.Prisma.question.findUnique({
      where: { id: questionId },
      select: {
        id: true,
        htmlQuestionContent: true,
        htmlSolutionContent: true,
        answer: true,
        selections: true,
        createdAt: true,
        updatedAt: true,
        images: true,
        labelPairs: {
          select: {
            label: true,
          },
        },
      },
    });

    if (!question) {
      throw new NotFoundException(`question not found with id ${questionId}`);
    }

    const questionImages = await Promise.all(
      question.images.map(async (image) => {
        const [file, fileDownloadUrl] = await this.fileService.getImageFileUrl(
          image.fileId,
        );

        return {
          id: image.id,
          file,
          fileDownloadUrl,
        };
      }),
    );

    return {
      id: question.id,
      htmlQuestionContent: question.htmlQuestionContent,
      htmlSolutionContent: question.htmlSolutionContent,
      answer: question.answer,
      selections:
        question.selections.length === 0
          ? undefined
          : (question.selections as [string, string, string, string, string]),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      images: questionImages,
      labels: question.labelPairs.map((pair) => pair.label),
    };
  }

  async createQuestion(
    htmlQuestionContent: string,
    htmlSolutionContent: string,
    answer: string,
    selections: [string, string, string, string, string] | null,
    imageFileIds: string[],
    labelIds: string[],
  ): Promise<Question> {
    const question = await this.dbService.Prisma.question.create({
      data: {
        htmlQuestionContent,
        htmlSolutionContent,
        answer,
        selections: selections === null ? [] : selections,
        images: {
          createMany: {
            data: imageFileIds.map((imageFileId) => ({
              fileId: imageFileId,
            })),
          },
        },
        labelPairs: {
          createMany: {
            data: labelIds.map((labelId) => ({
              labelId,
            })),
          },
        },
      },
      select: {
        id: true,
        htmlQuestionContent: true,
        htmlSolutionContent: true,
        answer: true,
        createdAt: true,
        updatedAt: true,
        images: true,
        labelPairs: {
          select: {
            label: true,
          },
        },
      },
    });

    const questionImages = await Promise.all(
      question.images.map(async (image) => {
        const [file, fileDownloadUrl] = await this.fileService.getImageFileUrl(
          image.fileId,
        );

        return {
          id: image.id,
          file,
          fileDownloadUrl,
        };
      }),
    );

    return {
      id: question.id,
      htmlQuestionContent: question.htmlQuestionContent,
      htmlSolutionContent: question.htmlSolutionContent,
      answer: question.answer,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      images: questionImages,
      labels: question.labelPairs.map((pair) => pair.label),
    };
  }

  async updateQuestion(
    questionId: string,
    htmlQuestionContent: string | undefined,
    htmlSolutionContent: string | undefined,
    answer: string | undefined,
    selections: [string, string, string, string, string] | null | undefined,
  ): Promise<Question> {
    try {
      const question = await this.dbService.Prisma.question.update({
        where: { id: questionId },
        data: {
          htmlQuestionContent,
          htmlSolutionContent,
          answer,
          selections: selections === null ? [] : selections,
        },
        select: {
          id: true,
          htmlQuestionContent: true,
          htmlSolutionContent: true,
          answer: true,
          selections: true,
          createdAt: true,
          updatedAt: true,
          images: true,
          labelPairs: {
            select: {
              label: true,
            },
          },
        },
      });

      const questionImages = await Promise.all(
        question.images.map(async (image) => {
          const [file, fileDownloadUrl] =
            await this.fileService.getImageFileUrl(image.fileId);

          return {
            id: image.id,
            file,
            fileDownloadUrl,
          };
        }),
      );

      return {
        id: question.id,
        htmlQuestionContent: question.htmlQuestionContent,
        htmlSolutionContent: question.htmlSolutionContent,
        answer: question.answer,
        selections:
          question.selections.length === 0
            ? undefined
            : (question.selections as [string, string, string, string, string]),
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
        images: questionImages,
        labels: question.labelPairs.map((pair) => pair.label),
      };
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (
          error.code === "P2025" &&
          error.meta?.["modelName"] === "Question"
        ) {
          throw new NotFoundException(
            `question not found with id ${questionId}`,
          );
        }
      }

      throw error;
    }
  }

  async updateQuestionImages(
    questionId: string,
    adds: string[],
    removes: string[],
    updates: {
      id: string;
      fileId?: string;
    }[],
  ): Promise<QuestionImage[]> {
    try {
      return await this.dbService.Prisma.$transaction(async (tx) => {
        if (adds.length) {
          await tx.questionImage.createMany({
            data: adds.map((add) => ({
              questionId,
              fileId: add,
            })),
          });
        }

        if (removes.length) {
          await tx.questionImage.deleteMany({
            where: {
              questionId,
              id: { in: removes },
            },
          });
        }

        if (updates.length) {
          await tx.questionImage.updateMany({
            where: {
              questionId,
              id: { in: updates.map((update) => update.id) },
            },
            data: updates.map((update) => ({
              id: update.id,
              fileId: update.fileId,
            })),
          });
        }

        const questionImages = await tx.questionImage.findMany({
          where: {
            questionId,
          },
          select: {
            id: true,
            fileId: true,
          },
        });

        return await Promise.all(
          questionImages.map(async (image) => {
            const [file, fileDownloadUrl] =
              await this.fileService.getImageFileUrl(image.fileId);

            return {
              id: image.id,
              file,
              fileDownloadUrl,
            };
          }),
        );
      });
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (
          error.code === "P2025" &&
          error.meta?.["modelName"] === "Question"
        ) {
          throw new NotFoundException(
            `question not found with id ${questionId}`,
          );
        }

        if (
          error.code === "P2025" &&
          error.meta?.["modelName"] === "QuestionImage"
        ) {
          throw new NotFoundException(
            `one of the ids provided is not a valid question image id`,
          );
        }
      }

      throw error;
    }
  }

  async updateQuestionLabels(
    questionId: string,
    adds: string[],
    removes: string[],
  ): Promise<QuestionLabel[]> {
    try {
      return await this.dbService.Prisma.$transaction(async (tx) => {
        if (adds.length) {
          await tx.questionLabelPair.createMany({
            data: adds.map((add) => ({
              questionId,
              labelId: add,
            })),
          });
        }

        if (removes.length) {
          await tx.questionLabelPair.deleteMany({
            where: {
              questionId,
              labelId: {
                in: removes,
              },
            },
          });
        }

        return await tx.questionLabelPair
          .findMany({
            where: {
              questionId,
            },
            select: {
              label: true,
            },
          })
          .then((pairs) => pairs.map((pair) => pair.label));
      });
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (
          error.code === "P2025" &&
          error.meta?.["modelName"] === "Question"
        ) {
          throw new NotFoundException(
            `question not found with id ${questionId}`,
          );
        }

        if (
          error.code === "P2025" &&
          error.meta?.["modelName"] === "QuestionLabel"
        ) {
          throw new NotFoundException(
            `one of the ids provided is not a valid question label id`,
          );
        }
      }

      throw error;
    }
  }

  async deleteQuestion(questionId: string): Promise<void> {
    try {
      await this.dbService.Prisma.question.delete({
        where: { id: questionId },
      });
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (
          error.code === "P2025" &&
          error.meta?.["modelName"] === "Question"
        ) {
          throw new NotFoundException(
            `question not found with id ${questionId}`,
          );
        }
      }

      throw error;
    }
  }
}
