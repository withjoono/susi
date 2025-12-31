import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "prisma/prisma-generated";

import {
  DocumentSection,
  DocumentSectionContent,
} from "@app/api/dto/document.dto";
import { DbService } from "@app/db/db.service";

@Injectable()
export class DocumentSectionService {
  constructor(private readonly dbService: DbService) {}

  async listDocumentSections(documentId: string): Promise<DocumentSection[]> {
    const sections = await this.dbService.Prisma.documentSection.findMany({
      select: {
        id: true,
        order: true,
        title: true,
        description: true,
        contentCount: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { documentId },
      orderBy: [
        {
          order: "asc",
        },
      ],
    });

    return sections.map((documentSection) => ({
      id: documentSection.id,
      order: documentSection.order,
      title: documentSection.title,
      description: documentSection.description,
      contentCount: documentSection.contentCount,
      createdAt: documentSection.createdAt.toISOString(),
      updatedAt: documentSection.updatedAt.toISOString(),
    }));
  }

  async getDocumentSection(
    documentId: string,
    id: string,
  ): Promise<DocumentSection> {
    const section = await this.dbService.Prisma.documentSection.findUnique({
      select: {
        id: true,
        order: true,
        title: true,
        description: true,
        contentCount: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { id, documentId },
    });

    if (!section) {
      throw new NotFoundException(`document section with id ${id} not found`);
    }

    return {
      id: section.id,
      order: section.order,
      title: section.title,
      description: section.description,
      contentCount: section.contentCount,
      createdAt: section.createdAt.toISOString(),
      updatedAt: section.updatedAt.toISOString(),
    };
  }

  async createDocumentSection(
    documentId: string,
    order: number,
    title: string,
    description: string | null,
  ): Promise<DocumentSection> {
    try {
      const section = await this.dbService.Prisma.documentSection.create({
        data: {
          document: {
            connect: {
              id: documentId,
            },
          },
          order,
          title,
          description,
        },
        select: {
          id: true,
          order: true,
          title: true,
          description: true,
          contentCount: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        id: section.id,
        order: section.order,
        title: section.title,
        description: section.description,
        contentCount: section.contentCount,
        createdAt: section.createdAt.toISOString(),
        updatedAt: section.updatedAt.toISOString(),
      };
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new BadRequestException("section order must be unique");
        } else if (
          error.code === "P2025" &&
          error.meta?.["modelName"] === "Document"
        ) {
          throw new NotFoundException(
            `document with id ${documentId} not found`,
          );
        }
      }

      throw error;
    }
  }

  async updateDocumentSection(
    documentId: string,
    id: string,
    order: number | undefined,
    title: string | undefined,
    description: string | null | undefined,
  ): Promise<DocumentSection> {
    try {
      const section = await this.dbService.Prisma.documentSection.update({
        data: {
          order,
          title,
          description,
        },
        where: { id, documentId },
        select: {
          id: true,
          order: true,
          title: true,
          description: true,
          contentCount: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        id: section.id,
        order: section.order,
        title: section.title,
        description: section.description,
        contentCount: section.contentCount,
        createdAt: section.createdAt.toISOString(),
        updatedAt: section.updatedAt.toISOString(),
      };
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new BadRequestException("section order must be unique");
        } else if (
          error.code === "P2025" &&
          error.meta?.["modelName"] === "DocumentSection"
        ) {
          throw new NotFoundException(
            `document section with id ${id} not found`,
          );
        }
      }

      throw error;
    }
  }

  async deleteDocumentSection(documentId: string, id: string): Promise<void> {
    try {
      await this.dbService.Prisma.$transaction(async (tx) => {
        const section = await tx.documentSection.delete({
          select: {
            documentId: true,
          },
          where: {
            id,
            documentId,
          },
        });

        await tx.document.update({
          data: {
            sectionCount: {
              decrement: 1,
            },
          },
          select: {
            id: true,
          },
          where: {
            id: section.documentId,
          },
        });
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException(
            `document section with id ${id} not found`,
          );
        }
      }

      throw error;
    }
  }
}
