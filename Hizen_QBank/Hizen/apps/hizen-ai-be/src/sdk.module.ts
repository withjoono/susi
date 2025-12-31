import { Module } from "@nestjs/common";

import { AgentModule } from "@app/agent/agent.module";
import { AuthModule } from "@app/auth/auth.module";
import { ChatSessionModule } from "@app/chat-session/chat-session.module";
import { CryptoModule } from "@app/crypto/crypto.module";
import { DbModule } from "@app/db/db.module";
import { DocumentModule } from "@app/document/document.module";
import { FileModule } from "@app/file/file.module";
import { HealthModule } from "@app/health/health.module";
import { QuestionModule } from "@app/question/question.module";
import { UserModule } from "@app/user/user.module";

export const SDK_MODULES = [
  AuthModule,
  CryptoModule,
  DbModule,
  HealthModule,
  FileModule,
  DocumentModule,
  QuestionModule,
  UserModule,
  AgentModule,
  ChatSessionModule,
];

@Module({
  imports: SDK_MODULES,
})
export class SdkModule {}
