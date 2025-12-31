import { Module } from "@nestjs/common";

import { AuthModule } from "@app/auth/auth.module";
import { ChatSessionModule } from "@app/chat-session/chat-session.module";
import { ChatSessionSseController } from "@app/chat-session/chat-session.sse.controller";

@Module({
  imports: [AuthModule, ChatSessionModule],
  controllers: [ChatSessionSseController],
})
export class ChatSessionSseModule {}
