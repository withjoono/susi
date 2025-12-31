import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "prisma/prisma-generated";

import { Document, DocumentCursor } from "@app/api/dto/document.dto";
import { DbService } from "@app/db/db.service";

@Injectable()
export class DocumentService {
  constructor(private readonly dbService: DbService) {}

  async listDocuments(
    cursor: DocumentCursor,
    pageSize: number,
  ): Promise<Document[]> {
    let where: Prisma.DocumentWhereInput = {};

    if (cursor.id && cursor.name) {
      where = {
        name: {
          gte: cursor.name,
        },
        id: {
          gt: cursor.id,
        },
      };
    }

    const documents = await this.dbService.Prisma.document.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        sectionCount: true,
        createdAt: true,
        updatedAt: true,
      },
      where,
      orderBy: [
        {
          name: "asc",
        },
        {
          id: "asc",
        },
      ],
      take: pageSize,
    });

    return documents.map((document) => ({
      id: document.id,
      name: document.name,
      description: document.description,
      sectionCount: document.sectionCount,
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
    }));
  }

  async getDocument(id: string): Promise<Document> {
    const document = await this.dbService.Prisma.document.findUnique({
      select: {
        id: true,
        name: true,
        description: true,
        sectionCount: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    return {
      id: document.id,
      name: document.name,
      description: document.description,
      sectionCount: document.sectionCount,
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
    };
  }

  async createDocument(
    name: string,
    description: string | null,
  ): Promise<Document> {
    const document = await this.dbService.Prisma.document.create({
      data: {
        name,
        description,
      },
      select: {
        id: true,
        name: true,
        description: true,
        sectionCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: document.id,
      name: document.name,
      description: document.description,
      sectionCount: document.sectionCount,
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
    };
  }

  async updateDocument(
    id: string,
    name: string | undefined,
    description: string | null | undefined,
  ): Promise<Document> {
    try {
      const document = await this.dbService.Prisma.document.update({
        data: {
          name,
          description,
        },
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          sectionCount: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        id: document.id,
        name: document.name,
        description: document.description,
        sectionCount: document.sectionCount,
        createdAt: document.createdAt.toISOString(),
        updatedAt: document.updatedAt.toISOString(),
      };
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (
          error.code === "P2025" &&
          error.meta?.["modelName"] === "Document"
        ) {
          throw new NotFoundException(`no document found with id ${id}`);
        }
      }

      throw error;
    }
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      await this.dbService.Prisma.document.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (
          error.code === "P2025" &&
          error.meta?.["modelName"] === "Document"
        ) {
          throw new NotFoundException(`no document found with id ${id}`);
        }
      }
    }
  }
}
