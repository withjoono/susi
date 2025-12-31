import { IChatGptSchema } from "@samchon/openapi";

import { LlmVendor } from "@app/agent/core/llm-vendor";

import { IChatMemoryProvider } from "./chat-memory";

export interface ToolMetaInput {
  memoryProvider: IChatMemoryProvider;
  vendor: LlmVendor;
}

export interface Tool {
  name: string;
  description: string;
  argsSchema?: IChatGptSchema.IParameters;
  prompt: string;
  inputType: unknown;
  outputType: unknown;
  trigger(metaInput: ToolMetaInput, args: unknown): Promise<[unknown, string]>;
}
