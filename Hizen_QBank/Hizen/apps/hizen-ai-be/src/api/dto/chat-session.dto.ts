import { tags } from "typia";

import { Question } from "./question.dto";
import { ThreadEvent } from "./thread.dto";

export interface ChatSession {
  id: string & tags.Format<"uuid">;
  eventCount: number;
  messageCount: number;
  htmlQuestionContent?: string;
  htmlSolutionContent?: string;
  answer?: string;
  selections?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export namespace CreateChatSession {
  export type Response = ChatSession;
}

export namespace GetChatSession {
  export type Response = ChatSession;
}

export namespace UpdateChatSession {
  export interface RequestBody {
    htmlQuestionContent?: string;
    htmlSolutionContent?: string;
    answer?: string;
    selections?: string[];
  }

  export type Response = ChatSession;
}

export namespace ListChatSessionThreadEvents {
  export type Response = ThreadEvent[];
}

export namespace CommitChatSession {
  export interface RequestBody {
    questionId?: string & tags.Format<"uuid">;
  }

  export type Response = Question;
}

export namespace StreamChatSessionResponse {
  export interface Request {
    message: string;
    imageFileIds: (string & tags.Format<"uuid">)[];
  }
}
