import { tags } from "typia";

export type IChatMessage =
  | IChatDeveloperMessage
  | IChatUserMessage
  | IChatAssistantMessage
  | IChatToolMessage;

export interface IChatMessageBase<T extends string> {
  id: string;
  role: T;
  timestamp: Date;
}

export interface IChatDeveloperMessage extends IChatMessageBase<"developer"> {
  contents: IChatMessageTextContent[];
}

export interface IChatUserMessage extends IChatMessageBase<"user"> {
  contents: IChatMessageContent[];
}

export interface IChatAssistantMessage extends IChatMessageBase<"assistant"> {
  contents: (IChatMessageTextContent | IChatMessageToolCallContent)[];
}

export interface IChatToolMessage extends IChatMessageBase<"tool"> {
  tool_call_id: string;
  tool_name: string;
  contents: IChatMessageTextContent[];
}

export type IChatMessageContent =
  | IChatMessageTextContent
  | IChatMessageImageContent;

export interface IChatMessageContentBase<T extends string> {
  type: T;
}

export interface IChatMessageTextContent
  extends IChatMessageContentBase<"text"> {
  text: string;
}

export interface IChatMessageImageContent
  extends IChatMessageContentBase<"image"> {
  image_url: string & tags.Format<"uri">;
}

export interface IChatMessageToolCallContent
  extends IChatMessageContentBase<"tool"> {
  id: string;
  tool_name: string;
  /**
   * The arguments of the tool call.
   *
   * The arguments are serialized as JSON string. Note that the arguments can be
   * a mangled or invalid JSON string.
   */
  arguments: string;
}
