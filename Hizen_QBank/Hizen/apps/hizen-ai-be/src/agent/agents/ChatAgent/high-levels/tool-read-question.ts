import { IChatMemory } from "../chat-memory";
import { Tool, ToolMetaInput } from "../tool";
import { serializeQuestion } from "./serialize-question";

export type ReadQuestionArgs = never;
export type ReadQuestionOutput = IChatMemory;

export const readQuestion: Tool = {
  name: "read-question",
  description: "Read a question from the user.",
  prompt: `
You have access to a specialized tool that can read the current question:

- **When to Use:**
  - When a user asks for information about the current question
  - When you need to read, analyze the question

- **How to Use:**
  - Trigger the tool without any arguments

- **Example Contexts:**
  - User: "I'd like to list the items broadly, rather than putting all details into the list."
  - You: "Let me examine your question, than I will update the question to reflect your request."
  - You: [trigger \`read_previous_question\` tool]
  - You: [after reading the question] "The current question is not showing all fields without any filtering or grouping. Let me update the question to list only name and [comprehensive description of the other fields]."
  - You: [trigger \`generate_exam_question\` tool with detailed context about which fields are needed and which fields should be omitted, mentioning problems in the current question]
  - User: [review the generated question and provide feedback]
`.trim(),
  inputType: undefined,
  outputType: undefined,
  trigger: async (
    metaInput: ToolMetaInput,
    _args: never,
  ): Promise<[IChatMemory, string]> => {
    const output = await metaInput.memoryProvider.readMemory();
    const outputString = `Here is the current question: ${serializeQuestion(
      output.questionPrompt,
      output.questionSelections,
      output.answer,
      output.solution,
    )}`;

    return [output, outputString];
  },
};
