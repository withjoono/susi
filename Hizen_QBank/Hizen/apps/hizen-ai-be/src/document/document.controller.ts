import { TypedBody, TypedParam, TypedQuery, TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { tags } from "typia";

import {
  CreateDocument,
  CreateDocumentSection,
  CreateDocumentSectionContent,
  Document,
  DocumentSection,
  DocumentSectionContent,
  ListDocuments,
  UpdateDocument,
  UpdateDocumentSection,
  UpdateDocumentSectionContent,
} from "@app/api/dto/document.dto";
import { DocumentSectionContentService } from "@app/document/providers/document.section.content.service";
import { DocumentSectionService } from "@app/document/providers/document.section.service";
import { DocumentService } from "@app/document/providers/document.service";

@ApiTags("documents")
@Controller("documents")
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly documentSectionService: DocumentSectionService,
    private readonly documentSectionContentService: DocumentSectionContentService,
  ) {}

  @TypedRoute.Get()
  async listDocuments(
    @TypedQuery() query: ListDocuments.RequestQuery,
  ): Promise<ListDocuments.Response> {
    return await this.documentService.listDocuments(
      {
        id: query.lastId,
        name: query.lastName,
      },
      query.limit,
    );
  }

  @TypedRoute.Get(":id")
  async getDocument(
    @TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<Document> {
    return await this.documentService.getDocument(id);
  }

  @TypedRoute.Get(":id/sections")
  async listDocumentSections(
    @TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<DocumentSection[]> {
    return await this.documentSectionService.listDocumentSections(id);
  }

  @TypedRoute.Get(":id/sections/:sectionId")
  async getDocumentSection(
    @TypedParam("id") id: string & tags.Format<"uuid">,
    @TypedParam("sectionId") sectionId: string & tags.Format<"uuid">,
  ): Promise<DocumentSection> {
    return await this.documentSectionService.getDocumentSection(id, sectionId);
  }

  @TypedRoute.Get(":id/sections/:sectionId/contents")
  async listDocumentSectionContents(
    @TypedParam("id") id: string & tags.Format<"uuid">,
    @TypedParam("sectionId") sectionId: string & tags.Format<"uuid">,
  ): Promise<DocumentSectionContent[]> {
    return await this.documentSectionContentService.listDocumentSectionContents(
      id,
      sectionId,
    );
  }

  @TypedRoute.Get(":id/sections/:sectionId/contents/:contentId")
  async getDocumentSectionContent(
    @TypedParam("id") id: string & tags.Format<"uuid">,
    @TypedParam("sectionId") sectionId: string & tags.Format<"uuid">,
    @TypedParam("contentId") contentId: string & tags.Format<"uuid">,
  ): Promise<DocumentSectionContent> {
    return await this.documentSectionContentService.getDocumentSectionContent(
      id,
      sectionId,
      contentId,
    );
  }

  @TypedRoute.Post()
  async createDocument(
    @TypedBody() body: CreateDocument.RequestBody,
  ): Promise<CreateDocument.Response> {
    return await this.documentService.createDocument(
      body.name,
      body.description,
    );
  }

  @TypedRoute.Post(":id/sections")
  async createDocumentSection(
    @TypedParam("id") id: string & tags.Format<"uuid">,
    @TypedBody() body: CreateDocumentSection.RequestBody,
  ): Promise<CreateDocumentSection.Response> {
    return await this.documentSectionService.createDocumentSection(
      id,
      body.order,
      body.title,
      body.description,
    );
  }

  @TypedRoute.Post(":id/sections/:sectionId/contents")
  async createDocumentSectionContent(
    @TypedParam("id") id: string & tags.Format<"uuid">,
    @TypedParam("sectionId") sectionId: string & tags.Format<"uuid">,
    @TypedBody() body: CreateDocumentSectionContent.RequestBody,
  ): Promise<CreateDocumentSectionContent.Response> {
    return await this.documentSectionContentService.createDocumentSectionContent(
      id,
      sectionId,
      body.order,
      body.type,
      body.data,
    );
  }

  @TypedRoute.Patch(":id")
  async updateDocument(
    @TypedParam("id") id: string & tags.Format<"uuid">,
    @TypedBody() body: UpdateDocument.RequestBody,
  ): Promise<UpdateDocument.Response> {
    return await this.documentService.updateDocument(
      id,
      body.name,
      body.description,
    );
  }

  @TypedRoute.Patch(":id/sections/:sectionId")
  async updateDocumentSection(
    @TypedParam("id") id: string & tags.Format<"uuid">,
    @TypedParam("sectionId") sectionId: string & tags.Format<"uuid">,
    @TypedBody() body: UpdateDocumentSection.RequestBody,
  ): Promise<UpdateDocumentSection.Response> {
    return await this.documentSectionService.updateDocumentSection(
      id,
      sectionId,
      body.order,
      body.title,
      body.description,
    );
  }

  @TypedRoute.Patch(":id/sections/:sectionId/contents/:contentId")
  async updateDocumentSectionContent(
    @TypedParam("id") id: string & tags.Format<"uuid">,
    @TypedParam("sectionId") sectionId: string & tags.Format<"uuid">,
    @TypedParam("contentId") contentId: string & tags.Format<"uuid">,
    @TypedBody() body: UpdateDocumentSectionContent.RequestBody,
  ): Promise<UpdateDocumentSectionContent.Response> {
    return await this.documentSectionContentService.updateDocumentSectionContent(
      id,
      sectionId,
      contentId,
      body.order,
      body.type,
      body.data,
    );
  }

  @TypedRoute.Delete(":id")
  async deleteDocument(
    @TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    await this.documentService.deleteDocument(id);
  }

  @TypedRoute.Delete(":id/sections/:sectionId")
  async deleteDocumentSection(
    @TypedParam("id") id: string & tags.Format<"uuid">,
    @TypedParam("sectionId") sectionId: string & tags.Format<"uuid">,
  ): Promise<void> {
    await this.documentSectionService.deleteDocumentSection(id, sectionId);
  }

  @TypedRoute.Delete(":id/sections/:sectionId/contents/:contentId")
  async deleteDocumentSectionContent(
    @TypedParam("id") id: string & tags.Format<"uuid">,
    @TypedParam("sectionId") sectionId: string & tags.Format<"uuid">,
    @TypedParam("contentId") contentId: string & tags.Format<"uuid">,
  ): Promise<void> {
    await this.documentSectionContentService.deleteDocumentSectionContent(
      id,
      sectionId,
      contentId,
    );
  }
}
