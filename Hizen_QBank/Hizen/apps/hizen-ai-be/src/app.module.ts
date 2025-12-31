import { Module } from "@nestjs/common";

import { ChatSessionSseModule } from "@app/chat-session/chat-session.sse.module";
import { SDK_MODULES } from "@app/sdk.module";

@Module({
  imports: [...SDK_MODULES, ChatSessionSseModule],
})
export class AppModule {}
