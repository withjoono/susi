import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Prisma } from "prisma/prisma-generated";

import { AuthTokenService } from "@app/auth/providers/auth.token.service";
import { UserSession } from "@app/auth/providers/express.request";
import { DbService } from "@app/db/db.service";

@Injectable()
export class AuthSessionService {
  constructor(
    private readonly authTokenService: AuthTokenService,
    private readonly dbService: DbService,
  ) {}

  async createUserSession(userId: string): Promise<{
    token: string;
    expiresAt: Date;
  }> {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // up to 30 days
    const session = await this.dbService.Prisma.userSession.create({
      data: {
        userId,
        expiresAt,
      },
      select: {
        id: true,
      },
    });

    return {
      token: session.id,
      expiresAt,
    };
  }

  async findUserSession(token: string): Promise<UserSession> {
    const session = await this.dbService.Prisma.userSession.findUnique({
      where: {
        id: token,
        user: {
          deletedAt: null,
        },
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            role: true,
          },
        },
        createdAt: true,
        expiresAt: true,
      },
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    return {
      id: session.id,
      userId: session.userId,
      userRole: session.user.role,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    };
  }

  async deleteUserSession(userId: string, token: string): Promise<void> {
    try {
      await this.dbService.Prisma.userSession.delete({
        where: {
          id: token,
          userId,
          expiresAt: {
            gt: new Date(),
          },
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundException(`there is no session with id ${token}`);
      }

      throw error;
    }
  }
}
