import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export const Session = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest<Request>().session;
  },
);
