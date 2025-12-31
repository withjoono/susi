import { Module } from "@nestjs/common";

import { DocumentController } from "@app/document/document.controller";
import { DocumentSectionContentService } from "@app/document/providers/document.section.content.service";
import { DocumentSectionService } from "@app/document/providers/document.section.service";
import { DocumentService } from "@app/document/providers/document.service";
import { SubjectService } from "@app/document/providers/subject.service";
import { SubjectController } from "@app/document/subject.controller";

@Module({
  providers: [
    DocumentService,
    DocumentSectionService,
    DocumentSectionContentService,
    SubjectService,
  ],
  exports: [
    DocumentService,
    DocumentSectionService,
    DocumentSectionContentService,
    SubjectService,
  ],
  controllers: [DocumentController, SubjectController],
})
export class DocumentModule {}
