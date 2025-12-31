import * as crypto from "crypto";
import OpenAI from "openai";
import { FunctionParameters } from "openai/resources/shared";
import { Stream } from "openai/streaming";
import { TypeGuardError } from "typia";

import { LlmBackoffStrategy } from "@app/agent/core/llm-backoff-strategy";
import { createCompletion } from "@app/agent/core/llm-create-completion";
import {
  IChatAssistantMessage,
  IChatMessage,
  IChatMessageImageContent,
  IChatMessageTextContent,
  IChatMessageToolCallContent,
  IChatToolMessage,
} from "@app/agent/structures/IChatMessage";
import { IVendor } from "@app/agent/structures/IVendor";

import { IChatMemoryProvider } from "./ChatAgent/chat-memory";
import { prompt } from "./ChatAgent/high-levels/prompt";
import { Tools, tools } from "./ChatAgent/high-levels/tools";
import { Tool } from "./ChatAgent/tool";

export interface IChatConfig {
  vendor: IVendor;
}

export class ChatAgent<M = undefined> {
  constructor(private config: IChatConfig) {}

  createMessageEmitter(sessionId: string): ChatAgentDriver<M> {
    return new ChatAgentDriver(sessionId, this.config);
  }
}

export type ChatAgentErrorHandler = (error: unknown) => void | Promise<void>;

export type ChatAgentEventHandler = (
  event: ChatAgentEvent,
) => void | Promise<void>;

export type ChatAgentMessageHandler = (
  message: IChatMessage,
) => void | Promise<void>;

export type ChatAgentStreamingMessageHandler = (
  id: string,
  role: "assistant",
  partialContent: string,
) => void | Promise<void>;

export type ChatAgentEvent =
  | ChatAgentPreLlmGenerationEvent
  | ChatAgentPostLlmGenerationEvent
  | ChatAgentPreProcessingEvent
  | ChatAgentPostProcessingEvent
  | ChatAgentInvalidToolNameEvent
  | ChatAgentInvalidToolJsonArgumentsEvent
  | ChatAgentPreToolCallEvent
  | ChatAgentPostToolCallEvent;

export interface ChatAgentEventBase<T extends string> {
  id: string;
  timestamp: Date;
  type: T;
}

export interface ChatAgentPreLlmGenerationEvent
  extends ChatAgentEventBase<"pre-llm-generation"> {
  sessionId: string;
  api: OpenAI;
  body: OpenAI.Chat.Completions.ChatCompletionCreateParams;
  options: OpenAI.RequestOptions | undefined;
  backoffStrategy: LlmBackoffStrategy;
}

export interface ChatAgentPostLlmGenerationEvent
  extends ChatAgentEventBase<"post-llm-generation"> {
  sessionId: string;
  api: OpenAI;
  body: OpenAI.Chat.Completions.ChatCompletionCreateParams;
  options: OpenAI.RequestOptions | undefined;
  backoffStrategy: LlmBackoffStrategy;
  completion: (
    | OpenAI.Chat.Completions.ChatCompletion
    | Stream<OpenAI.Chat.Completions.ChatCompletionChunk>
  ) & {
    _request_id?: string | null;
  };
  startTimestamp: Date;
  endTimestamp: Date;
}

export interface ChatAgentPreProcessingEvent
  extends ChatAgentEventBase<"pre-processing"> {}

export interface ChatAgentPostProcessingEvent
  extends ChatAgentEventBase<"post-processing"> {
  error?: unknown;
}

export interface ChatAgentInvalidToolNameEvent
  extends ChatAgentEventBase<"invalid-tool-name"> {
  toolCall: ToolCallPart;
}

export interface ChatAgentInvalidToolJsonArgumentsEvent
  extends ChatAgentEventBase<"invalid-tool-json-arguments"> {
  toolCall: ToolCallPart;
  error: unknown;
}

export type ChatAgentPreToolCallEventGeneric<T extends Record<string, Tool>> = {
  [K in keyof T]: {
    toolName: K;
    input: T[K]["inputType"];
  };
}[keyof T];

export interface ChatAgentPostToolCallEventBase<T extends string>
  extends ChatAgentEventBase<"post-tool-call"> {
  state: T;
}

export type ChatAgentPostToolCallEventSuccessGeneric<
  T extends Record<string, Tool>,
> = {
  [K in keyof T]: {
    toolName: K;
    input: T[K]["inputType"];
    output: T[K]["outputType"];
    outputString: string;
  };
}[keyof T];

export type ChatAgentPostToolCallEventFailureGeneric<
  T extends Record<string, Tool>,
> = {
  [K in keyof T]: {
    toolName: K;
    input: T[K]["inputType"];
    error: unknown;
  };
}[keyof T];

export type ChatAgentPostToolCallEventInvalidInputArgumentsGeneric<
  T extends Record<string, Tool>,
> = {
  [K in keyof T]: {
    toolName: K;
    input: Record<string, unknown>;
    error: TypeGuardError;
  };
}[keyof T];

export type ChatAgentPostToolCallEventSuccess =
  ChatAgentPostToolCallEventBase<"success"> &
    ChatAgentPostToolCallEventSuccessGeneric<Tools>;

export type ChatAgentPostToolCallEventFailure =
  ChatAgentPostToolCallEventBase<"failure"> &
    ChatAgentPostToolCallEventFailureGeneric<Tools>;

export type ChatAgentPostToolCallEventInvalidInputArguments =
  ChatAgentPostToolCallEventBase<"invalid-input-arguments"> &
    ChatAgentPostToolCallEventInvalidInputArgumentsGeneric<Tools>;

export type ChatAgentPreToolCallEvent = ChatAgentEventBase<"pre-tool-call"> &
  ChatAgentPreToolCallEventGeneric<Tools>;

export type ChatAgentPostToolCallEvent =
  | ChatAgentPostToolCallEventSuccess
  | ChatAgentPostToolCallEventFailure
  | ChatAgentPostToolCallEventInvalidInputArguments;

export class ChatAgentDriver<M = undefined> {
  private errorHandler?: ChatAgentErrorHandler;
  private eventHandler?: ChatAgentEventHandler;
  private messageHandler?: ChatAgentMessageHandler;
  private streamingMessageHandler?: ChatAgentStreamingMessageHandler;

  constructor(
    private sessionId: string,
    private config: IChatConfig,
  ) {}

  withErrorHandler(handler: ChatAgentErrorHandler): ChatAgentDriver<M> {
    this.errorHandler = handler;
    return this;
  }

  withEventHandler(handler: ChatAgentEventHandler): ChatAgentDriver<M> {
    this.eventHandler = handler;
    return this;
  }

  withMessageHandler(handler: ChatAgentMessageHandler): ChatAgentDriver<M> {
    this.messageHandler = handler;
    return this;
  }

  withStreamingMessageHandler(
    handler: ChatAgentStreamingMessageHandler,
  ): ChatAgentDriver<M> {
    this.streamingMessageHandler = handler;
    return this;
  }

  private async sendError(context: string, error: unknown): Promise<void> {
    try {
      await this.errorHandler?.(
        `[ERROR] ${context}: ${JSON.stringify(error, null, 2)}`,
      );
    } catch {
      // SAFETY: It might be useful if we have some mechanism to handle cases where error reporting is not possible.
      // Currently this kind of errors are not handled.
    }
  }

  private async sendEvent<
    T extends Exclude<
      ChatAgentEvent["type"],
      ChatAgentPostToolCallEvent["type"]
    >,
  >(
    type: T,
    event: Omit<
      Extract<ChatAgentEvent, { type: T }>,
      "id" | "timestamp" | "type"
    >,
    pairId?: string,
  ): Promise<string> {
    const id = pairId ?? crypto.randomUUID();
    const timestamp = new Date();

    try {
      const completeEvent = {
        id,
        timestamp,
        type,
        ...event,
      } as Extract<ChatAgentEvent, { type: T }>;
      await this.eventHandler?.(completeEvent as ChatAgentEvent);
    } catch (error: unknown) {
      await this.sendError(`emitting event ${type}`, error);
    }

    return id;
  }

  private async sendPostToolCallEvent<
    T extends ChatAgentPostToolCallEvent["state"],
  >(
    state: T,
    event: Omit<
      Extract<ChatAgentPostToolCallEvent, { state: T }>,
      "id" | "timestamp" | "type" | "state"
    >,
    pairId?: string,
  ): Promise<string> {
    const id = pairId ?? crypto.randomUUID();
    const timestamp = new Date();

    try {
      const completeEvent = {
        id,
        timestamp,
        type: "post-tool-call",
        state,
        ...event,
      } as Extract<ChatAgentPostToolCallEvent, { state: T }>;
      await this.eventHandler?.(completeEvent as ChatAgentPostToolCallEvent);
    } catch (error: unknown) {
      await this.sendError(`emitting ${state} event of post-tool-call`, error);
    }

    return id;
  }

  private async sendMessage(message: IChatMessage): Promise<void> {
    try {
      await this.messageHandler?.(message);
    } catch (error: unknown) {
      await this.sendError(`sending message ${message.id}`, error);
    }
  }

  private async sendStreamingMessage(
    id: string,
    role: "assistant",
    partialContent: string,
  ): Promise<void> {
    try {
      await this.streamingMessageHandler?.(id, role, partialContent);
    } catch (error: unknown) {
      await this.sendError(`sending streaming message ${id}`, {
        error,
        id,
        role,
        partialContent,
      });
    }
  }

  async send(
    threadContextProvider: IChatMemoryProvider,
    context: IChatMessage[],
    userMessage: string,
    userMessageImageFileUrls: string[],
  ): Promise<void> {
    const userMessageItem = {
      id: crypto.randomUUID(),
      role: "user",
      timestamp: new Date(),
      contents: [
        {
          type: "text",
          text: userMessage,
        } satisfies IChatMessageTextContent,
        ...userMessageImageFileUrls.map(
          (url) =>
            ({
              type: "image",
              image_url: url,
            }) satisfies IChatMessageImageContent,
        ),
      ],
    } satisfies IChatMessage;

    await this.sendMessage(userMessageItem);
    context.push(userMessageItem);

    for (;;) {
      const result = await this.processTurn(threadContextProvider, context);

      if (!result.assistantMessage) {
        break;
      }

      if ((result.toolMessages?.length ?? 0) === 0) {
        break;
      }

      context.push(result.assistantMessage);
      context.push(...(result.toolMessages ?? []));
    }
  }

  private async processTurn(
    memoryProvider: IChatMemoryProvider,
    context: IChatMessage[],
  ): Promise<TurnResult> {
    try {
      const preProcessingEventId = await this.sendEvent("pre-processing", {});

      const [id, timestamp, content, toolCalls] = await this.callStream(
        context,
      ).catch(async (error) => {
        await this.sendEvent(
          "post-processing",
          { error },
          preProcessingEventId,
        );

        throw error;
      });
      await this.sendEvent("post-processing", {}, preProcessingEventId);

      const assistantMessage = {
        id,
        role: "assistant",
        timestamp,
        contents: [
          {
            type: "text",
            text: content,
          } satisfies IChatMessageTextContent,
          ...toolCalls.map(
            (toolCall) =>
              ({
                type: "tool",
                id: toolCall.id,
                tool_name: toolCall.toolName,
                arguments: toolCall.arguments,
              }) satisfies IChatMessageToolCallContent,
          ),
        ],
      } satisfies IChatAssistantMessage;
      await this.sendMessage(assistantMessage);

      if (toolCalls.length === 0) {
        return {
          assistantMessage,
          toolMessages: [],
        };
      }

      interface CallResult {
        value: string;
        timestamp: Date;
      }

      const results = await Promise.all(
        toolCalls.map((toolCall) =>
          this.callTool(memoryProvider, toolCall).then(
            (result) =>
              ({
                value: result,
                timestamp: new Date(),
              }) satisfies CallResult,
          ),
        ),
      );
      const joined = toolCalls.map((toolCall, index) => ({
        toolCall,
        result: results[index],
      }));

      const toolMessages = joined.map(
        ({ toolCall, result }) =>
          ({
            id: toolCall.id,
            role: "tool",
            timestamp: result.timestamp,
            tool_call_id: toolCall.id,
            tool_name: toolCall.toolName,
            contents: [
              {
                type: "text",
                text: result.value,
              } satisfies IChatMessageTextContent,
            ],
          }) satisfies IChatToolMessage,
      );

      for (const toolMessage of toolMessages) {
        await this.sendMessage(toolMessage);
      }

      return {
        assistantMessage,
        toolMessages,
      };
    } catch (error: unknown) {
      await this.sendError("calling the LLM", error);

      return {};
    }
  }

  private async callStream(
    context: IChatMessage[],
  ): Promise<[string, Date, string, ToolCallPart[]]> {
    let preLlmGenerationEvent: ChatAgentPreLlmGenerationEvent | undefined;

    const stream = await createCompletion(
      this.config.vendor.api,
      createBodyFromContext(this.config, context),
      this.config.vendor.options,
      undefined,
      (api, body, options, backoffStrategy) => {
        preLlmGenerationEvent = {
          id: crypto.randomUUID(),
          timestamp: new Date(),
          type: "pre-llm-generation",
          sessionId: this.sessionId,
          api,
          body,
          options,
          backoffStrategy,
        };
      },
    );

    if (preLlmGenerationEvent) {
      await this.sendEvent(
        "pre-llm-generation",
        preLlmGenerationEvent,
        preLlmGenerationEvent.id,
      );
    }

    let id: string | undefined;
    let timestamp: Date | undefined;
    let usage: OpenAI.Completions.CompletionUsage | undefined;
    let finishReason:
      | OpenAI.Chat.Completions.ChatCompletion.Choice["finish_reason"]
      | undefined;
    let completion: OpenAI.Chat.Completions.ChatCompletion | undefined;
    const toolCallParts: Map<number, ToolCallPart> = new Map();
    const contentParts: string[] = [];

    for await (const chunk of stream) {
      if (!id) {
        id = chunk.id;
      }

      if (!timestamp) {
        timestamp = new Date(chunk.created);
      }

      if (!usage) {
        usage = chunk.usage ?? undefined;
      }

      if (!completion) {
        completion = {
          id: chunk.id,
          choices: [],
          created: chunk.created,
          model: chunk.model,
          object: "chat.completion",
          service_tier: chunk.service_tier,
          system_fingerprint: chunk.system_fingerprint,
        };
      }

      const choice = chunk.choices[0];

      if (!choice) {
        continue;
      }

      if (choice.delta.content) {
        contentParts.push(choice.delta.content);
        await this.sendStreamingMessage(
          chunk.id,
          "assistant",
          choice.delta.content,
        );
      }

      if (choice.delta.tool_calls) {
        for (const toolCall of choice.delta.tool_calls) {
          let toolCallPart = toolCallParts.get(toolCall.index);

          if (!toolCallPart) {
            toolCallPart = {
              id: toolCall.id ?? "",
              toolName: toolCall.function?.name ?? "",
              arguments: toolCall.function?.arguments ?? "",
            };

            toolCallParts.set(toolCall.index, toolCallPart);
          } else {
            if (toolCall.id) {
              toolCallPart.id += toolCall.id;
            }
            if (toolCall.function?.name) {
              toolCallPart.toolName += toolCall.function.name;
            }

            if (toolCall.function?.arguments) {
              toolCallPart.arguments += toolCall.function.arguments;
            }
          }
        }
      }

      if (choice.finish_reason) {
        finishReason = choice.finish_reason;
      }
    }

    const endTimestamp = new Date();
    const toolCalls = Array.from(toolCallParts.entries())
      .sort(([a], [b]) => a - b)
      .map(([, toolCallPart]) => toolCallPart);
    const content = contentParts.join("");

    if (finishReason && completion) {
      if (usage) {
        completion.usage = usage;
      }

      completion.choices.push({
        index: 0,
        logprobs: null,
        finish_reason: finishReason,
        message: {
          role: "assistant",
          content: content,
          refusal: null,
          tool_calls:
            toolCalls.length === 0
              ? undefined
              : toolCalls.map((toolCall) => ({
                  id: toolCall.id,
                  type: "function",
                  function: {
                    name: toolCall.toolName,
                    arguments: toolCall.arguments,
                  },
                })),
        },
      });
    }

    if (preLlmGenerationEvent && completion) {
      await this.sendEvent(
        "post-llm-generation",
        {
          sessionId: preLlmGenerationEvent.sessionId,
          api: preLlmGenerationEvent.api,
          body: preLlmGenerationEvent.body,
          options: preLlmGenerationEvent.options,
          backoffStrategy: preLlmGenerationEvent.backoffStrategy,
          completion,
          startTimestamp: preLlmGenerationEvent.timestamp,
          endTimestamp,
        },
        preLlmGenerationEvent.id,
      );
    }

    return [id ?? "", timestamp ?? new Date(), content, toolCalls];
  }

  private async callTool(
    memoryProvider: IChatMemoryProvider,
    toolCall: ToolCallPart,
  ): Promise<string> {
    const tool: Tool | undefined = tools[toolCall.toolName];

    if (tool === undefined) {
      await this.sendEvent("invalid-tool-name", {
        toolCall,
      });

      return Promise.resolve(
        `[FAILURE] Unknown tool name: ${toolCall.toolName}`,
      );
    }

    let parsedArgs: unknown;

    try {
      parsedArgs = JSON.parse(toolCall.arguments);
    } catch (error: unknown) {
      await this.sendEvent("invalid-tool-json-arguments", {
        toolCall,
        error,
      });

      return Promise.resolve(`[FAILURE] Unable to parse arguments: ${error}`);
    }

    const preToolCallEventId = await this.sendEvent("pre-tool-call", {
      toolName: toolCall.toolName as keyof Tools,
      input: parsedArgs as Tools[keyof Tools]["inputType"],
    });

    try {
      const [output, outputString] = await tool.trigger(
        {
          memoryProvider,
          vendor: this.config.vendor,
        },
        parsedArgs,
      );

      await this.sendPostToolCallEvent(
        "success",
        {
          toolName: toolCall.toolName as keyof Tools,
          input: parsedArgs as Tools[keyof Tools]["inputType"],
          output: output as Tools[keyof Tools]["outputType"],
          outputString,
        },
        preToolCallEventId,
      );

      return outputString;
    } catch (error: unknown) {
      if (error instanceof TypeGuardError) {
        await this.sendPostToolCallEvent(
          "invalid-input-arguments",
          {
            toolName: toolCall.toolName as keyof Tools,
            input: parsedArgs as Record<string, unknown>,
            error,
          },
          preToolCallEventId,
        );

        return Promise.resolve(`[FAILURE] Invalid arguments: ${error}`);
      }

      await this.sendPostToolCallEvent(
        "failure",
        {
          toolName: toolCall.toolName as keyof Tools,
          input: parsedArgs as Tools[keyof Tools]["inputType"],
          error,
        },
        preToolCallEventId,
      );

      return Promise.resolve(`[FAILURE] ${error}`);
    }
  }
}

interface TurnResult {
  assistantMessage?: IChatAssistantMessage;
  toolMessages?: IChatToolMessage[];
}

export interface ToolCallPart {
  id: string;
  toolName: string;
  arguments: string;
}

function createBodyFromContext(
  config: IChatConfig,
  context: IChatMessage[],
): OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming {
  return {
    model: config.vendor.model,
    messages: [
      {
        role: "developer",
        content: prompt({}),
      },
      ...context.map(toOpenAIMessage),
    ],
    ...(config.vendor.isThinkingEnabled ? { reasoning_effort: "medium" } : {}),
    tools: Object.values(tools).map((tool) => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.argsSchema as FunctionParameters | undefined,
      },
    })),
    stream: true,
    stream_options: {
      include_usage: true,
    },
  };
}

function toOpenAIMessage(
  message: IChatMessage,
): OpenAI.Chat.Completions.ChatCompletionMessageParam {
  switch (message.role) {
    case "developer": {
      return {
        role: "developer",
        content: message.contents.map(
          (content) =>
            ({
              type: "text",
              text: content.text,
            }) satisfies OpenAI.Chat.Completions.ChatCompletionContentPartText,
        ),
      } satisfies OpenAI.Chat.Completions.ChatCompletionDeveloperMessageParam;
    }
    case "user": {
      return {
        role: "user",
        content: message.contents.map((content) =>
          content.type === "image"
            ? ({
                type: "image_url",
                image_url: {
                  url: content.image_url,
                  detail: "auto",
                },
              } satisfies OpenAI.Chat.Completions.ChatCompletionContentPartImage)
            : ({
                type: "text",
                text: content.text,
              } satisfies OpenAI.Chat.Completions.ChatCompletionContentPartText),
        ),
      } satisfies OpenAI.Chat.Completions.ChatCompletionUserMessageParam;
    }
    case "assistant": {
      const toolCalls = message.contents
        .filter((content) => content.type === "tool")
        .map(
          (content) =>
            ({
              id: content.id,
              type: "function",
              function: {
                name: content.tool_name,
                arguments: content.arguments,
              },
            }) satisfies OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
        );
      const isContentEmpty =
        toolCalls.length !== 0 &&
        message.contents.filter(
          (content) => content.type === "text" && content.text.length !== 0,
        ).length === 0;

      return {
        role: "assistant",
        content: isContentEmpty
          ? undefined
          : message.contents
              .filter((content) => content.type === "text")
              .map(
                (content) =>
                  ({
                    type: "text",
                    text: content.text,
                  }) satisfies OpenAI.Chat.Completions.ChatCompletionContentPartText,
              ),
        tool_calls: toolCalls.length === 0 ? undefined : toolCalls,
      } satisfies OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam;
    }
    case "tool": {
      return {
        role: "tool",
        tool_call_id: message.tool_call_id,
        content: message.contents.map(
          (content) =>
            ({
              type: "text",
              text: content.text,
            }) satisfies OpenAI.Chat.Completions.ChatCompletionContentPartText,
        ),
      } satisfies OpenAI.Chat.Completions.ChatCompletionToolMessageParam;
    }
  }
}
