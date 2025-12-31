import { TypedBody, TypedParam } from "@nestia/core";
import {
  Controller,
  ForbiddenException,
  RequestMethod,
  Res,
  Session,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { Observable, ReplaySubject, catchError, map, of } from "rxjs";

import { StreamChatSessionResponse } from "@app/api/dto/chat-session.dto";
import { AuthSessionGuard } from "@app/auth/providers/auth.session.guard";
import { UserSession } from "@app/auth/providers/express.request";
import { ChatSessionService } from "@app/chat-session/providers/chat-session.service";
import { Sse } from "@app/decorators/sse.decorator";

@ApiTags("chat-sessions (sse)")
@UseGuards(AuthSessionGuard)
@Controller("chat-sessions")
export class ChatSessionSseController {
  constructor(private readonly chatSessionService: ChatSessionService) {}

  @Sse({
    path: ":sessionId/response",
    method: RequestMethod.POST,
  })
  async streamChatSessionResponse(
    @TypedParam("sessionId") sessionId: string,
    @TypedBody() body: StreamChatSessionResponse.Request,
    @Session() session: UserSession,
    @Res() res: Response,
  ): Promise<Observable<{ data: string }>> {
    if (session.userRole !== "ADMIN") {
      throw new ForbiddenException(
        "only admins can stream chat session response",
      );
    }

    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    try {
      const events = await this.chatSessionService.streamResponse(
        sessionId,
        body.message,
        body.imageFileIds,
      );

      return events.pipe(
        map((event) => ({
          data: JSON.stringify(event),
        })),
        catchError((error: unknown) =>
          of({
            data: JSON.stringify({
              type: "error",
              error: String(error),
            }),
          }),
        ),
      );
    } catch (error: unknown) {
      const subject = new ReplaySubject<{ data: string }>();

      subject.next({
        data: JSON.stringify({
          type: "error",
          error: String(error),
        }),
      });
      subject.complete();

      return subject.asObservable();
    }
  }
}
