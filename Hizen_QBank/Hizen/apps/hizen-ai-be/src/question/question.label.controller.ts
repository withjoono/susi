import { TypedBody, TypedParam, TypedRoute } from "@nestia/core";
import { Controller, ForbiddenException, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { tags } from "typia";

import {
  CreateQuestionLabel,
  QuestionLabel,
  UpdateQuestionLabel,
} from "@app/api/dto";
import { Session } from "@app/auth/providers/auth.session.decorator";
import { AuthSessionGuard } from "@app/auth/providers/auth.session.guard";
import { UserSession } from "@app/auth/providers/express.request";
import { QuestionLabelService } from "@app/question/providers/question.label.service";

@ApiTags("question-labels")
@UseGuards(AuthSessionGuard)
@Controller("question-labels")
export class QuestionLabelController {
  constructor(private readonly questionLabelService: QuestionLabelService) {}

  @TypedRoute.Get()
  async listQuestionLabels(
    @Session() session: UserSession,
  ): Promise<QuestionLabel[]> {
    if (session.userRole !== "ADMIN") {
      throw new ForbiddenException("only admins can list question labels");
    }

    return await this.questionLabelService.listQuestionLabels();
  }

  @TypedRoute.Post()
  async createQuestionLabel(
    @Session() session: UserSession,
    @TypedBody() body: CreateQuestionLabel.RequestBody,
  ): Promise<QuestionLabel> {
    if (session.userRole !== "ADMIN") {
      throw new ForbiddenException("only admins can create question labels");
    }

    return await this.questionLabelService.createQuestionLabel(
      body.name,
      body.content,
    );
  }

  @TypedRoute.Patch(":id")
  async updateQuestionLabel(
    @Session() session: UserSession,
    @TypedParam("id") id: string & tags.Format<"uuid">,
    @TypedBody() body: UpdateQuestionLabel.RequestBody,
  ): Promise<QuestionLabel> {
    if (session.userRole !== "ADMIN") {
      throw new ForbiddenException("only admins can update question labels");
    }

    return await this.questionLabelService.updateQuestionLabel(
      id,
      body.name,
      body.content,
    );
  }

  @TypedRoute.Delete(":id")
  async deleteQuestionLabel(
    @Session() session: UserSession,
    @TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    if (session.userRole !== "ADMIN") {
      throw new ForbiddenException("only admins can delete question labels");
    }

    await this.questionLabelService.deleteQuestionLabel(id);
  }
}
