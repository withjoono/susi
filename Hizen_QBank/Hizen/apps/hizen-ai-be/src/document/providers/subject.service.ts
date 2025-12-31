import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Prisma } from "prisma/prisma-generated";

import { Subject } from "@app/api/dto/document.dto";
import { DbService } from "@app/db/db.service";

@Injectable()
export class SubjectService {
  constructor(private readonly dbService: DbService) {}

  async listSubjects(): Promise<Subject[]> {
    const subjects = await this.dbService.Prisma.subject.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        {
          createdAt: "asc",
        },
        {
          id: "asc",
        },
      ],
    });

    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      description: subject.description,
      parentId: subject.parentId,
      createdAt: subject.createdAt.toISOString(),
      updatedAt: subject.updatedAt.toISOString(),
    }));
  }

  async getSubject(id: string): Promise<Subject> {
    const subject = await this.dbService.Prisma.subject.findUnique({
      select: {
        id: true,
        name: true,
        description: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException(`no subject found with id ${id}`);
    }

    return {
      id: subject.id,
      name: subject.name,
      description: subject.description,
      parentId: subject.parentId,
      createdAt: subject.createdAt.toISOString(),
      updatedAt: subject.updatedAt.toISOString(),
    };
  }

  async createSubject(
    name: string,
    description: string | null,
    parentId: string | null,
  ): Promise<Subject> {
    try {
      // SAFETY: it is safe to create a subject without checking loop,
      // because it is not possible to create a loop by creating a new subject
      const subject = await this.dbService.Prisma.subject.create({
        data: {
          name,
          description,
          parent: {
            connect: {
              id: parentId ?? undefined,
            },
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          parentId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        id: subject.id,
        name: subject.name,
        description: subject.description,
        parentId: subject.parentId,
        createdAt: subject.createdAt.toISOString(),
        updatedAt: subject.updatedAt.toISOString(),
      };
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025" && error.meta?.["modelName"] === "Subject") {
          throw new NotFoundException(`no subject found with id ${parentId}`);
        }
      }

      throw error;
    }
  }

  async updateSubject(
    id: string,
    name: string | undefined,
    description: string | null | undefined,
    parentId: string | null | undefined,
  ): Promise<Subject> {
    try {
      const subject = await this.dbService.Prisma.$transaction(async (tx) => {
        let currentParentId = parentId;

        while (currentParentId != null) {
          if (currentParentId === id) {
            throw new UnprocessableEntityException(
              `children(or itself) ${parentId} cannot be parent of the subject ${id}`,
            );
          }

          const currentParent = await tx.subject.findUnique({
            select: {
              parentId: true,
            },
            where: {
              id: currentParentId,
            },
          });

          if (!currentParent) {
            break;
          }

          currentParentId = currentParent.parentId;
        }

        return await tx.subject.update({
          data: {
            name,
            description,
            parent: {
              connect: {
                id: parentId ?? undefined,
              },
            },
          },
          select: {
            id: true,
            name: true,
            description: true,
            parentId: true,
            createdAt: true,
            updatedAt: true,
          },
          where: { id },
        });
      });

      return {
        id: subject.id,
        name: subject.name,
        description: subject.description,
        parentId: subject.parentId,
        createdAt: subject.createdAt.toISOString(),
        updatedAt: subject.updatedAt.toISOString(),
      };
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025" && error.meta?.["modelName"] === "Subject") {
          throw new NotFoundException(
            `no subject found with id ${id} or parentId ${parentId}`,
          );
        }
      }

      throw error;
    }
  }

  async deleteSubject(id: string): Promise<void> {
    try {
      await this.dbService.Prisma.subject.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025" && error.meta?.["modelName"] === "Subject") {
          throw new NotFoundException(`no subject found with id ${id}`);
        }
      }

      throw error;
    }
  }
}
