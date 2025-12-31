import OpenAI from "openai";

export interface LlmVendor {
  api: OpenAI;
  model: OpenAI.ChatModel;
  isThinkingEnabled?: boolean;
  options?: OpenAI.RequestOptions;
}
