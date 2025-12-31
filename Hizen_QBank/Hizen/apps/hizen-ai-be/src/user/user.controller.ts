import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { GetCurrentUser } from "@app/api/dto/user.dto";
import { Session } from "@app/auth/providers/auth.session.decorator";
import { AuthSessionGuard } from "@app/auth/providers/auth.session.guard";
import { UserSession } from "@app/auth/providers/express.request";
import { UserService } from "@app/user/providers/user.service";

@ApiTags("users")
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthSessionGuard)
  @Get("current-user")
  async getCurrentUser(
    @Session() session: UserSession,
  ): Promise<GetCurrentUser.Response> {
    return await this.userService.getUser(session.userId);
  }
}
