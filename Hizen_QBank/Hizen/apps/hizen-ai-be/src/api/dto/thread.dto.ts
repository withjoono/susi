export type ThreadEvent =
  | ThreadErrorEvent
  | ThreadTaskEvent
  | ThreadMessageEvent;

export interface ThreadEventBase<T extends string> {
  id: String;
  order: number;
  createdAt: Date;
  type: T;
}

export interface ThreadErrorEvent extends ThreadEventBase<"error"> {
  error: string;
}

export interface ThreadTaskEvent extends ThreadEventBase<"task"> {
  taskId: string;
  taskType: string;
  taskPhase: "pre" | "post" | "error";
  taskError?: string;
}

export interface ThreadMessageEvent extends ThreadEventBase<"message"> {
  speaker: "user" | "assistant";
  contents: ThreadMessageContent[];
}

export type ThreadMessageContent =
  | ThreadMessageContentText
  | ThreadMessageContentImage;

export interface ThreadMessageContentBase<T extends string> {
  type: T;
}

export interface ThreadMessageContentText
  extends ThreadMessageContentBase<"text"> {
  text: string;
}

export interface ThreadMessageContentImage
  extends ThreadMessageContentBase<"image"> {
  imageUrl: string;
}
