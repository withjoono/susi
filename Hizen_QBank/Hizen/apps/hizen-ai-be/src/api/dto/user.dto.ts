import { tags } from "typia";

export interface User {
  id: string & tags.Format<"uuid">;
  email?: string;
  username: string;
  nickname: string;
  role: string;
  profileImageUrl?: string;
  joinedAt: Date;
}

export namespace GetCurrentUser {
  export type Response = User;
}
