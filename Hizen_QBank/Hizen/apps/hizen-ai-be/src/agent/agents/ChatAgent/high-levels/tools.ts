import {
  GenerateExamQuestionArgs,
  GenerateExamQuestionOutput,
  generateExamQuestion,
} from "./tool-generate-exam-question";
import {
  ReadQuestionArgs,
  ReadQuestionOutput,
  readQuestion,
} from "./tool-read-question";

export const tools = {
  "read-question": {
    ...readQuestion,
    inputType: {} as ReadQuestionArgs,
    outputType: {} as ReadQuestionOutput,
  },
  "generate-exam-question": {
    ...generateExamQuestion,
    inputType: {} as GenerateExamQuestionArgs,
    outputType: {} as GenerateExamQuestionOutput,
  },
} as const;

export type Tools = typeof tools;
