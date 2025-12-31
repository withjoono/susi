import { TypedBody, TypedParam, TypedRoute } from "@nestia/core";
import { Controller, Logger, Session, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PrismaClientKnownRequestError } from "prisma/prisma-generated/runtime/library";

import { Authenticate } from "@app/api/dto";
import { AuthService } from "@app/auth/providers/auth.service";
import { AuthSessionGuard } from "@app/auth/providers/auth.session.guard";
import { AuthSessionService } from "@app/auth/providers/auth.session.service";
import { UserSession } from "@app/auth/providers/express.request";
import { GlobalConfig } from "@app/global/global";

@ApiTags("auth")
@Controller("user-sessions")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly authSessionService: AuthSessionService,
  ) {
    if (
      process.env.NODE_ENV !== "local" &&
      process.env.NODE_ENV !== "development"
    ) {
      return;
    }

    if (
      GlobalConfig.Instance.TestAdminEmail &&
      GlobalConfig.Instance.TestAdminUsername &&
      GlobalConfig.Instance.TestAdminPassword
    ) {
      this.logger.warn("creating test admin user");
      this.authService
        .create(
          GlobalConfig.Instance.TestAdminEmail,
          GlobalConfig.Instance.TestAdminUsername,
          GlobalConfig.Instance.TestAdminPassword,
          null,
          null,
        )
        .then((userId) => {
          this.logger.warn(`test admin user created with id ${userId}`);
        })
        .catch((error: unknown) => {
          if (error instanceof PrismaClientKnownRequestError) {
            if (
              error.code === "P2002" &&
              error.meta?.["modelName"] === "User" &&
              (error.meta?.["target"]?.[0] === "email" ||
                error.meta?.["target"]?.[0] === "username")
            ) {
              this.logger.warn("test admin user already exists; skipping");
              return;
            }
          }

          this.logger.warn("failed to create test admin user", error);
        });
    }
  }

  @TypedRoute.Post()
  async authenticate(
    @TypedBody() body: Authenticate.Body,
  ): Promise<Authenticate.Response> {
    const userId = await this.authService.authenticate(
      body.email,
      body.password,
    );

    const { token, expiresAt } =
      await this.authSessionService.createUserSession(userId);

    return {
      token,
      expiresAt,
    };
  }

  @UseGuards(AuthSessionGuard)
  @TypedRoute.Delete(":id")
  async delete(
    @TypedParam("id") id: string,
    @Session() session: UserSession,
  ): Promise<void> {
    await this.authSessionService.deleteUserSession(session.userId, id);
  }
}
