import { TypedBody, TypedParam, TypedQuery, TypedRoute } from "@nestia/core";
import { Controller, ForbiddenException, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { tags } from "typia";

import {
  CreateQuestion,
  GetQuestion,
  ListQuestions,
  UpdateQuestion,
  UpdateQuestionImages,
  UpdateQuestionLabels,
} from "@app/api/dto";
import { Session } from "@app/auth/providers/auth.session.decorator";
import { AuthSessionGuard } from "@app/auth/providers/auth.session.guard";
import { UserSession } from "@app/auth/providers/express.request";
import { QuestionService } from "@app/question/providers/question.service";

@ApiTags("questions")
@UseGuards(AuthSessionGuard)
@Controller("questions")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @TypedRoute.Get()
  async listQuestions(
    @Session() session: UserSession,
    @TypedQuery() query: ListQuestions.RequestQuery,
  ): Promise<ListQuestions.Response> {
    if (session.userRole !== "ADMIN") {
      throw new ForbiddenException("only admins can list questions");
    }

    return await this.questionService.listQuestions(
      query.pageSize,
      query.filter ? { labelIds: query.filter } : undefined,
      query.lastQuestionId && query.lastQuestionCreatedAt
        ? {
            lastQuestionId: query.lastQuestionId,
            lastQuestionCreatedAt: new Date(query.lastQuestionCreatedAt),
          }
        : undefined,
    );
  }

  @TypedRoute.Get(":id")
  async getQuestion(
    @Session() session: UserSession,
    @TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<GetQuestion.Response> {
    if (session.userRole !== "ADMIN") {
      throw new ForbiddenException("only admins can get questions");
    }

    return await this.questionService.getQuestion(id);
  }

  @TypedRoute.Post()
  async createQuestion(
    @Session() session: UserSession,
    @TypedBody() body: CreateQuestion.RequestBody,
  ): Promise<CreateQuestion.Response> {
    if (session.userRole !== "ADMIN") {
      throw new ForbiddenException("only admins can create questions");
    }

    return await this.questionService.createQuestion(
      body.htmlQuestionContent,
      body.htmlSolutionContent,
      body.answer,
      body.selections,
      body.imageFileIds,
      body.labelIds,
    );
  }

  @TypedRoute.Patch(":id")
  async updateQuestion(
    @Session() session: UserSession,
    @TypedParam("id") id: string & tags.Format<"uuid">,
    @TypedBody() body: UpdateQuestion.RequestBody,
  ): Promise<UpdateQuestion.Response> {
    if (session.userRole !== "ADMIN") {
      throw new ForbiddenException("only admins can update questions");
    }

    return await this.questionService.updateQuestion(
      id,
      body.htmlQuestionContent,
      body.htmlSolutionContent,
      body.answer,
      body.selections,
    );
  }

  @TypedRoute.Patch(":id/images")
  async updateQuestionImages(
    @Session() session: UserSession,
    @TypedParam("id") id: string & tags.Format<"uuid">,
    @TypedBody() body: UpdateQuestionImages.RequestBody,
  ): Promise<UpdateQuestionImages.Response> {
    if (session.userRole !== "ADMIN") {
      throw new ForbiddenException("only admins can update question images");
    }

    return await this.questionService.updateQuestionImages(
      id,
      body.adds,
      body.removes,
      body.updates,
    );
  }

  @TypedRoute.Patch(":id/labels")
  async updateQuestionLabels(
    @Session() session: UserSession,
    @TypedParam("id") id: string & tags.Format<"uuid">,
    @TypedBody() body: UpdateQuestionLabels.RequestBody,
  ): Promise<UpdateQuestionLabels.Response> {
    if (session.userRole !== "ADMIN") {
      throw new ForbiddenException("only admins can update question labels");
    }

    return await this.questionService.updateQuestionLabels(
      id,
      body.adds,
      body.removes,
    );
  }

  @TypedRoute.Delete(":id")
  async deleteQuestion(
    @Session() session: UserSession,
    @TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    if (session.userRole !== "ADMIN") {
      throw new ForbiddenException("only admins can delete questions");
    }

    await this.questionService.deleteQuestion(id);
  }
}
