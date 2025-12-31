import { TypedBody, TypedParam, TypedRoute } from "@nestia/core";
import {
  Controller,
  ForbiddenException,
  Session,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import {
  CommitChatSession,
  CreateChatSession,
  GetChatSession,
  ListChatSessionThreadEvents,
  UpdateChatSession,
} from "@app/api/dto/chat-session.dto";
import { AuthSessionGuard } from "@app/auth/providers/auth.session.guard";
import { UserSession } from "@app/auth/providers/express.request";
import { ChatSessionService } from "@app/chat-session/providers/chat-session.service";

@ApiTags("chat-sessions")
@UseGuards(AuthSessionGuard)
@Controller("chat-sessions")
export class ChatSessionController {
  constructor(private readonly chatSessionService: ChatSessionService) {}

  @TypedRoute.Post()
  async createChatSession(
    @Session() session: UserSession,
  ): Promise<CreateChatSession.Response> {
    if (session.userRole !== "ADMIN") {
      throw new ForbiddenException("only admins can create chat sessions");
    }

    return await this.chatSessionService.createChatSession();
  }

  @TypedRoute.Get(":sessionId")
  async getChatSession(
    @TypedParam("sessionId") sessionId: string,
    @Session() session: UserSession,
  ): Promise<GetChatSession.Response> {
    return await this.chatSessionService.getChatSession(sessionId);
  }

  @TypedRoute.Patch(":sessionId")
  async updateChatSession(
    @TypedParam("sessionId") sessionId: string,
    @TypedBody() body: UpdateChatSession.RequestBody,
    @Session() session: UserSession,
  ): Promise<UpdateChatSession.Response> {
    return await this.chatSessionService.updateChatSession(sessionId, body);
  }

  @TypedRoute.Get(":sessionId/events")
  async listChatSessionThreadEvents(
    @TypedParam("sessionId") sessionId: string,
    @Session() session: UserSession,
  ): Promise<ListChatSessionThreadEvents.Response> {
    if (session.userRole !== "ADMIN") {
      throw new ForbiddenException("only admins can list chat session events");
    }

    return await this.chatSessionService.listChatSessionThreadEvents(sessionId);
  }

  @TypedRoute.Post(":sessionId/commit")
  async commitChatSession(
    @TypedParam("sessionId") sessionId: string,
    @TypedBody() body: CommitChatSession.RequestBody,
    @Session() session: UserSession,
  ): Promise<CommitChatSession.Response> {
    if (session.userRole !== "ADMIN") {
      throw new ForbiddenException("only admins can commit chat sessions");
    }

    return await this.chatSessionService.commitChatSession(
      sessionId,
      body.questionId,
    );
  }
}
