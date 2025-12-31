import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "prisma/prisma-generated";

import { DocumentSectionContent } from "@app/api/dto/document.dto";
import { DbService } from "@app/db/db.service";

@Injectable()
export class DocumentSectionContentService {
  constructor(private readonly dbService: DbService) {}

  async listDocumentSectionContents(
    documentId: string,
    sectionId: string,
  ): Promise<DocumentSectionContent[]> {
    const contents =
      await this.dbService.Prisma.documentSectionContent.findMany({
        select: {
          id: true,
          order: true,
          type: true,
          text: true,
          imageUrl: true,
        },
        where: {
          sectionId,
          section: {
            documentId,
          },
        },
        orderBy: [{ order: "asc" }],
      });

    return contents.map((content) => ({
      id: content.id,
      order: content.order,
      type: content.type,
      text: content.text,
      imageUrl: content.imageUrl,
    }));
  }

  async getDocumentSectionContent(
    documentId: string,
    sectionId: string,
    id: string,
  ): Promise<DocumentSectionContent> {
    const content =
      await this.dbService.Prisma.documentSectionContent.findUnique({
        select: {
          id: true,
          order: true,
          type: true,
          text: true,
          imageUrl: true,
        },
        where: { id, sectionId, section: { documentId } },
      });

    if (!content) {
      throw new NotFoundException(
        `document section content with id ${id} not found`,
      );
    }

    return {
      id: content.id,
      order: content.order,
      type: content.type,
      text: content.text,
      imageUrl: content.imageUrl,
    };
  }

  async createDocumentSectionContent(
    documentId: string,
    sectionId: string,
    order: number,
    type: "TEXT" | "IMAGE",
    data: string | null,
  ): Promise<DocumentSectionContent> {
    try {
      const content = await this.dbService.Prisma.documentSectionContent.create(
        {
          data: {
            section: {
              connect: {
                id: sectionId,
                documentId,
              },
            },
            order,
            type,
            text: type === "TEXT" ? data : null,
            imageUrl: type === "IMAGE" ? data : null,
          },
          select: {
            id: true,
            order: true,
            type: true,
            text: true,
            imageUrl: true,
          },
        },
      );

      return {
        id: content.id,
        order: content.order,
        type: content.type,
        text: content.text,
        imageUrl: content.imageUrl,
      };
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new BadRequestException("content order must be unique");
        } else if (
          error.code === "P2025" &&
          error.meta?.["modelName"] === "DocumentSection"
        ) {
          throw new NotFoundException(
            `document section with id ${sectionId} not found`,
          );
        }
      }

      throw error;
    }
  }

  async updateDocumentSectionContent(
    documentId: string,
    sectionId: string,
    id: string,
    order: number | undefined,
    type: "TEXT" | "IMAGE" | undefined,
    data: string | undefined,
  ): Promise<DocumentSectionContent> {
    try {
      const content = await this.dbService.Prisma.documentSectionContent.update(
        {
          data: {
            order,
            type,
            text: type === "TEXT" ? data : null,
            imageUrl: type === "IMAGE" ? data : null,
          },
          select: {
            id: true,
            order: true,
            type: true,
            text: true,
            imageUrl: true,
          },
          where: { id, sectionId, section: { documentId } },
        },
      );

      return {
        id: content.id,
        order: content.order,
        type: content.type,
        text: content.text,
        imageUrl: content.imageUrl,
      };
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new BadRequestException("content order must be unique");
        } else if (
          error.code === "P2025" &&
          error.meta?.["modelName"] === "DocumentSectionContent"
        ) {
          throw new NotFoundException(
            `document section content with id ${id} not found`,
          );
        }
      }

      throw error;
    }
  }

  async deleteDocumentSectionContent(
    documentId: string,
    sectionId: string,
    id: string,
  ): Promise<void> {
    try {
      await this.dbService.Prisma.documentSectionContent.delete({
        where: { id, sectionId, section: { documentId } },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (
          error.code === "P2025" &&
          error.meta?.["modelName"] === "DocumentSectionContent"
        ) {
          throw new NotFoundException(
            `document section content with id ${id} not found`,
          );
        }

        throw error;
      }
    }
  }
}
