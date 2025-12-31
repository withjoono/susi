import { TypedBody, TypedParam, TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { tags } from "typia";

import {
  CreateSubject,
  Subject,
  UpdateSubject,
} from "@app/api/dto/document.dto";
import { SubjectService } from "@app/document/providers/subject.service";

@ApiTags("subjects")
@Controller("subjects")
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @TypedRoute.Get()
  async listSubjects(): Promise<Subject[]> {
    return await this.subjectService.listSubjects();
  }

  @TypedRoute.Get(":id")
  async getSubject(
    @TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<Subject> {
    return await this.subjectService.getSubject(id);
  }

  @TypedRoute.Post()
  async createSubject(
    @TypedBody() body: CreateSubject.RequestBody,
  ): Promise<CreateSubject.Response> {
    return await this.subjectService.createSubject(
      body.name,
      body.description,
      body.parentId,
    );
  }

  @TypedRoute.Patch(":id")
  async updateSubject(
    @TypedParam("id") id: string & tags.Format<"uuid">,
    @TypedBody() body: UpdateSubject.RequestBody,
  ): Promise<UpdateSubject.Response> {
    return await this.subjectService.updateSubject(
      id,
      body.name,
      body.description,
      body.parentId,
    );
  }

  @TypedRoute.Delete(":id")
  async deleteSubject(
    @TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    await this.subjectService.deleteSubject(id);
  }
}
