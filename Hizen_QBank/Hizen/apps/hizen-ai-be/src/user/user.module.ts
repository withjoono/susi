import { Module } from "@nestjs/common";

import { UserService } from "@app/user/providers/user.service";
import { UserController } from "@app/user/user.controller";

@Module({
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
