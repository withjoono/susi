import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";

import { AuthSessionService } from "@app/auth/providers/auth.session.service";

@Injectable()
export class AuthSessionGuard implements CanActivate {
  constructor(private readonly authSessionService: AuthSessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.header("Authorization");

    if (!authorization) {
      throw new UnauthorizedException();
    }

    if (!authorization.toLowerCase().startsWith("bearer ")) {
      throw new UnauthorizedException();
    }

    const token = authorization.slice(7);
    const session = await this.authSessionService.findUserSession(token);
    request.session = session;

    return true;
  }
}
