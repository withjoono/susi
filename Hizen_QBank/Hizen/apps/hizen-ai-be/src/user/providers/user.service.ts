import { Injectable, NotFoundException } from "@nestjs/common";

import { User } from "@app/api/dto/user.dto";
import { DbService } from "@app/db/db.service";

@Injectable()
export class UserService {
  constructor(private readonly dbService: DbService) {}

  async getUser(userId: string): Promise<User> {
    const user = await this.dbService.Prisma.user.findUnique({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: {
        email: true,
        username: true,
        nickname: true,
        role: true,
        profileImageUrl: true,
        joinedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`no user found with id ${userId}`);
    }

    return {
      id: userId,
      email: user.email ?? undefined,
      username: user.username,
      nickname: user.nickname,
      role: user.role,
      profileImageUrl: user.profileImageUrl ?? undefined,
      joinedAt: user.joinedAt,
    };
  }
}
