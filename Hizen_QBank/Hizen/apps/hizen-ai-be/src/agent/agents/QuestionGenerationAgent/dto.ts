import { PreGenerationCallback } from "@app/agent/core/llm-callback";
import { LlmVendor } from "@app/agent/core/llm-vendor";

export interface Input {
  vendor: LlmVendor;
  textbookConcept: string;
  goodQuestionExample: string;
  questionType: "subjective" | "objective";
  context: string;
  onPreLlmGeneration?: PreGenerationCallback;
}

export interface Output {
  questionPrompt: string;
  questionSelections?: [string, string, string, string, string];
  answer: string;
  solution: string;
}
