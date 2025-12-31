import { ThreadMessageEvent } from "./thread.dto";

export type ChatSessionThreadEvent =
  | ChatSessionErrorEvent
  | ChatSessionProcessingTaskEvent
  | ChatSessionReadQuestionTaskEvent
  | ChatSessionGenerateQuestionTaskEvent
  | ChatSessionStreamingMessageEvent
  | ChatSessionStreamingMessageCompleteEvent
  | ChatSessionTurnEndEvent;

export interface ChatSessionEventBase<T extends string> {
  type: T;
}

export interface ChatSessionErrorEvent extends ChatSessionEventBase<"error"> {
  error: unknown;
}

export interface ChatSessionTaskEventBase<T extends string>
  extends ChatSessionEventBase<"task"> {
  id: string;
  taskType: T;
  phase: ChatSessionTaskPhase;
  error?: unknown;
}

export interface ChatSessionProcessingTaskEvent
  extends ChatSessionTaskEventBase<"processing"> {}

export interface ChatSessionReadQuestionTaskEvent
  extends ChatSessionTaskEventBase<"read-question"> {}

export interface ChatSessionGenerateQuestionTaskEvent
  extends ChatSessionTaskEventBase<"generate-question"> {
  generatedQuestion?: string;
  generatedAnswer?: string;
  generatedSolution?: string;
  generatedSelections?: [string, string, string, string, string] | null;
}

export type ChatSessionTaskPhase = "pre" | "post" | "error";

export interface ChatSessionStreamingMessageEvent
  extends ChatSessionEventBase<"assistant-chat-partial-content"> {
  partialContent: string;
}

export interface ChatSessionStreamingMessageCompleteEvent
  extends ChatSessionEventBase<"assistant-chat-complete"> {
  message: ThreadMessageEvent;
}

export interface ChatSessionTurnEndEvent
  extends ChatSessionEventBase<"turn-end"> {}
