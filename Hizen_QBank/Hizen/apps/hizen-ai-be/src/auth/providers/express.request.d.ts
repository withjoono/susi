import { UserRole } from "prisma/prisma-generated";
import { tags } from "typia";

export interface UserSession {
  id: string & tags.Format<"uuid">;
  userId: string & tags.Format<"uuid">;
  userRole: UserRole;
  createdAt: Date;
  expiresAt: Date | null;
}

declare module "express" {
  interface Request {
    session?: UserSession;
  }
}
