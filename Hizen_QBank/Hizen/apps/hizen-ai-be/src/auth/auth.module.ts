import { Global, Module } from "@nestjs/common";

import { AuthController } from "@app/auth/auth.controller";
import { AuthService } from "@app/auth/providers/auth.service";
import { AuthSessionGuard } from "@app/auth/providers/auth.session.guard";
import { AuthSessionService } from "@app/auth/providers/auth.session.service";
import { AuthTokenService } from "@app/auth/providers/auth.token.service";

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthSessionGuard,
    AuthSessionService,
    AuthTokenService,
  ],
  exports: [
    AuthService,
    AuthSessionGuard,
    AuthSessionService,
    AuthTokenService,
  ],
})
export class AuthModule {}
