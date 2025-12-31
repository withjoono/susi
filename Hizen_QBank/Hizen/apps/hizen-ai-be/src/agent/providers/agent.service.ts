import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { Observable, Subject } from "rxjs";

import { ChatAgent } from "@app/agent/agents/ChatAgent";
import { AgentContextService } from "@app/agent/providers/agent.context.service";
import { AgentMemoryService } from "@app/agent/providers/agent.memory.service";
import {
  ChatSessionGenerateQuestionTaskEvent,
  ChatSessionProcessingTaskEvent,
  ChatSessionReadQuestionTaskEvent,
  ChatSessionThreadEvent,
} from "@app/api/dto/agent.dto";

@Injectable()
export class AgentService {
  constructor(
    private readonly agentContextService: AgentContextService,
    private readonly agentMemoryService: AgentMemoryService,
  ) {}

  async chat(
    sessionId: string,
    userMessage: string,
    userMessageImageFileUrls: string[],
  ): Promise<Observable<ChatSessionThreadEvent>> {
    const apiKey = await this.agentContextService.getOpenAiApiKey();
    const context = await this.agentContextService.getThreadContext(sessionId);

    const api = new OpenAI({
      apiKey,
    });
    const chatAgent = new ChatAgent({
      vendor: {
        api,
        model: "o4-mini",
        isThinkingEnabled: true,
      },
    });
    const driver = chatAgent.createMessageEmitter(sessionId);
    const eventSubject = new Subject<ChatSessionThreadEvent>();

    driver.withErrorHandler(async (error) => {
      const errorEvent = {
        type: "error" as const,
        error: String(error),
      };
      eventSubject.next(errorEvent);
      await this.agentContextService.createThreadEvent(sessionId, errorEvent);
    });
    driver.withEventHandler(async (event) => {
      let taskEvent:
        | ChatSessionProcessingTaskEvent
        | ChatSessionReadQuestionTaskEvent
        | ChatSessionGenerateQuestionTaskEvent;

      switch (event.type) {
        case "pre-processing":
          {
            taskEvent = {
              type: "task",
              id: event.id,
              taskType: "processing",
              phase: "pre",
            };
          }
          break;
        case "post-processing":
          {
            taskEvent = {
              type: "task",
              id: event.id,
              taskType: "processing",
              phase: event.error ? "error" : "post",
              error: event.error,
            };
          }
          break;
        case "pre-tool-call":
          {
            switch (event.toolName) {
              case "read-question":
                {
                  taskEvent = {
                    type: "task",
                    id: event.id,
                    taskType: "read-question",
                    phase: "pre",
                  };
                }
                break;
              case "generate-exam-question":
                {
                  taskEvent = {
                    type: "task",
                    id: event.id,
                    taskType: "generate-question",
                    phase: "pre",
                  };
                }
                break;
            }
          }
          break;
        case "post-tool-call":
          {
            switch (event.toolName) {
              case "read-question":
                switch (event.state) {
                  case "success":
                    {
                      taskEvent = {
                        type: "task",
                        id: event.id,
                        taskType: "read-question",
                        phase: "post",
                      };
                    }
                    break;
                  case "failure":
                    {
                      taskEvent = {
                        type: "task",
                        id: event.id,
                        taskType: "read-question",
                        phase: "error",
                      };
                    }
                    break;
                  case "invalid-input-arguments":
                    {
                      taskEvent = {
                        type: "task",
                        id: event.id,
                        taskType: "read-question",
                        phase: "error",
                        error: event.error,
                      };
                    }
                    break;
                }
                break;
              case "generate-exam-question":
                switch (event.state) {
                  case "success":
                    {
                      taskEvent = {
                        type: "task",
                        id: event.id,
                        taskType: "generate-question",
                        phase: "post",
                        generatedQuestion: event.output.questionPrompt,
                        generatedAnswer: event.output.answer,
                        generatedSolution: event.output.solution,
                        generatedSelections: event.output.questionSelections,
                      };
                    }
                    break;
                  case "failure":
                    {
                      taskEvent = {
                        type: "task",
                        id: event.id,
                        taskType: "generate-question",
                        phase: "error",
                        error: event.error,
                      };
                    }
                    break;
                  case "invalid-input-arguments":
                    {
                      taskEvent = {
                        type: "task",
                        id: event.id,
                        taskType: "generate-question",
                        phase: "error",
                        error: event.error,
                      };
                    }
                    break;
                }
                break;
            }
          }
          break;
        default:
          return;
      }

      eventSubject.next(taskEvent);
      await this.agentContextService.createThreadEvent(sessionId, taskEvent);
    });
    driver.withMessageHandler(async (message) => {
      await this.agentContextService.createThreadMessage(sessionId, message);

      switch (message.role) {
        case "user":
          {
            await this.agentContextService.createThreadEventMessage(
              sessionId,
              "user",
              message.contents,
            );
          }
          break;
        case "assistant":
          {
            const textContents = message.contents.filter(
              (content) => content.type === "text",
            );

            if (textContents.length !== 0) {
              const msg =
                await this.agentContextService.createThreadEventMessage(
                  sessionId,
                  "assistant",
                  textContents,
                );

              eventSubject.next({
                type: "assistant-chat-complete",
                message: msg,
              });
            }
          }
          break;
        case "tool":
          break;
      }
    });
    driver.withStreamingMessageHandler((_id, _role, partialContent) => {
      eventSubject.next({
        type: "assistant-chat-partial-content",
        partialContent,
      });
    });

    driver
      .send(
        {
          readMemory: async () => await this.agentMemoryService.read(sessionId),
        },
        context,
        userMessage,
        userMessageImageFileUrls,
      )
      .catch(async (error) => {
        const errorEvent = {
          type: "error" as const,
          error: String(error),
        };
        eventSubject.next(errorEvent);
        await this.agentContextService.createThreadEvent(sessionId, errorEvent);
      })
      .finally(() => {
        eventSubject.next({
          type: "turn-end",
        });
        eventSubject.complete();
      });

    return eventSubject.asObservable();
  }
}
