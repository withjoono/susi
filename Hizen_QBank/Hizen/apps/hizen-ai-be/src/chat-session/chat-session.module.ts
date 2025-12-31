import { Module } from "@nestjs/common";

import { AgentModule } from "@app/agent/agent.module";
import { AuthModule } from "@app/auth/auth.module";
import { ChatSessionController } from "@app/chat-session/chat-session.controller";
import { ChatSessionService } from "@app/chat-session/providers/chat-session.service";
import { FileModule } from "@app/file/file.module";
import { QuestionModule } from "@app/question/question.module";

@Module({
  imports: [AuthModule, AgentModule, QuestionModule, FileModule],
  providers: [ChatSessionService],
  exports: [ChatSessionService],
  controllers: [ChatSessionController],
})
export class ChatSessionModule {}
