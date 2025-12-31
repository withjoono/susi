import typia from "typia";

import {
  Agent as QuestionGenerationAgent,
  Input as QuestionGenerationInput,
  Output as QuestionGenerationOutput,
} from "@app/agent/agents/QuestionGenerationAgent";

import { Tool, ToolMetaInput } from "../tool";
import { serializeQuestion } from "./serialize-question";

export interface GenerateExamQuestionArgs {
  /**
   * Textbook concept.
   *
   * The concept of the textbook that the question is about.
   */
  textbook_concept: string;

  /**
   * Good question example.
   *
   * An example of a good question.
   */
  good_question_example: string;

  /**
   * Question type.
   *
   * The type of the question.
   */
  question_type: "subjective" | "objective";

  /**
   * Context.
   *
   * Detailed instructions for generating the question.
   */
  context: string;
}

export type GenerateExamQuestionOutput = QuestionGenerationOutput;

export const generateExamQuestion: Tool = {
  name: "generate-exam-question",
  description: "Generate an exam question based on user requirements.",
  argsSchema: typia.llm.parameters<GenerateExamQuestionArgs, "chatgpt">(),
  prompt: `
You have access to a specialized tool that can generate or update exam questions based on user requirements:

- **When to Use:** 
  - When a user explicitly asks for a question to be generated or modified
  - When a user wants to fix issues in their current question

- **How to Use:** 
  - Trigger the tool with detailed context about what needs to be generated or modified
  - Include specific requirements about the question type, content, and format
  - For modifications, include the current question and clearly explain what needs to change

- **Important Notes:**
  - The tool creates read-only questions (no interactive elements like buttons or inputs)
  - The tool uses a specific question format and structure
  - The tool generates exam questions that must be valid and logical

- **Context Requirements:**
  - Provide detailed description of the question's purpose and content
  - Include specific question type, content, and format
  - For modifications: include previous question and specific issues to fix

- **Best Practices:**
  1. Be Specific: Provide clear details about the desired question type, content, and format
  2. Include Examples: Reference familiar question types when possible (e.g., "like a multiple choice question" or "similar to a fill in the blank question")
  3. For Fixes: Clearly identify what's broken and how it should function correctly
`.trim(),
  inputType: undefined,
  outputType: undefined,
  trigger: async (
    metaInput: ToolMetaInput,
    args: GenerateExamQuestionArgs,
  ): Promise<[QuestionGenerationOutput, string]> => {
    typia.assertGuard<GenerateExamQuestionArgs>(args);

    const input = {
      vendor: metaInput.vendor,
      textbookConcept: args.textbook_concept,
      goodQuestionExample: args.good_question_example,
      questionType: args.question_type,
      context: args.context,
    } satisfies QuestionGenerationInput;

    const output = await new QuestionGenerationAgent().execute(input);
    const outputString = serializeQuestion(
      output.questionPrompt,
      output.questionSelections,
      output.answer,
      output.solution,
    );

    return [output, outputString];
  },
};
