export interface IChatMemory {
  questionPrompt: string;
  questionSelections?: [string, string, string, string, string];
  answer: string;
  solution: string;
}

export interface IChatMemoryProvider {
  readMemory(): Promise<IChatMemory>;
}
