import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as argon2 from "argon2";

import { DbService } from "@app/db/db.service";

@Injectable()
export class AuthService {
  constructor(private readonly dbService: DbService) {}

  async create(
    email: string,
    username: string,
    password: string,
    nickname: string | null | undefined,
    profileImageUrl: string | null | undefined,
  ): Promise<string> {
    const passwordHash = await argon2.hash(password);
    const user = await this.dbService.Prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        nickname: nickname ?? username,
        role: "ADMIN",
        profileImageUrl,
      },
      select: {
        id: true,
      },
    });

    return user.id;
  }

  async authenticate(email: string, password: string): Promise<string> {
    const user = await this.dbService.Prisma.user.findUnique({
      where: {
        email,
        deletedAt: null,
        role: "ADMIN",
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      // perform password hashing to prevent timing attacks
      await argon2.hash(password);
      throw new UnauthorizedException();
    }

    const isPasswordCorrect = await argon2.verify(user.passwordHash, password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }

    return user.id;
  }
}
