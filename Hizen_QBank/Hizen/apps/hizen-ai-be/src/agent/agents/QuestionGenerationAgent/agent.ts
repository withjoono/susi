import { LlmFailure } from "@app/agent/core/errors";
import { FixedPipeline } from "@app/agent/core/fixed-pipeline";
import { LlmProxy } from "@app/agent/core/llm-proxy";

import { Input, Output } from "./dto";
import { prompt } from "./prompt";

export class Agent implements FixedPipeline<Input, Output> {
  async execute(input: Input): Promise<Output> {
    const systemPrompt = prompt({
      textbook_concept: input.textbookConcept,
      good_question_example: input.goodQuestionExample,
      question_type: input.questionType,
      context: input.context,
    });

    const llmProxy = new LlmProxy<Input, Output>().withTextHandler(handleText);

    if (input.onPreLlmGeneration) {
      llmProxy.withPreGenerationCallback(input.onPreLlmGeneration);
    }

    const results = await llmProxy.call(
      input,
      input.vendor.api,
      {
        model: input.vendor.model,
        messages: [
          {
            role: "user",
            content: systemPrompt,
          },
        ],
        ...(input.vendor.isThinkingEnabled
          ? { reasoning_effort: "medium" }
          : {}),
      },
      input.vendor.options,
    );

    const result = results[0];

    if (result == null) {
      throw new LlmFailure(`expect 1 output, but got ${results.length}`);
    }

    return result;
  }
}

function handleText(input: Input, text: string): Output {
  const output =
    input.questionType === "subjective"
      ? parseSubjectiveOutput(text)
      : parseObjectiveOutput(text);

  return {
    questionPrompt: output.question_prompt,
    questionSelections: output.question_selections,
    answer: output.answer,
    solution: output.solution,
  };
}

interface TextOutput {
  question_prompt: string;
  question_selections?: [string, string, string, string, string];
  answer: string;
  solution: string;
}

function parseSubjectiveOutput(text: string): TextOutput {
  const question_prompt = text.match(
    /<question_prompt>([\s\S]*?)<\/question_prompt>/,
  );
  const answer = text.match(/<answer>([\s\S]*?)<\/answer>/);
  const solution = text.match(/<solution>([\s\S]*?)<\/solution>/);

  if (question_prompt?.[1] == null) {
    throw new LlmFailure(
      `failed to parse the output; your response should contain a question prompt within <question_prompt> tags`,
    );
  }

  if (answer?.[1] == null) {
    throw new LlmFailure(
      `failed to parse the output; your response should contain an answer within <answer> tags`,
    );
  }

  if (solution?.[1] == null) {
    throw new LlmFailure(
      `failed to parse the output; your response should contain a solution within <solution> tags`,
    );
  }

  return {
    question_prompt: question_prompt[1].trim(),
    answer: answer[1].trim(),
    solution: solution[1].trim(),
  };
}

function parseObjectiveOutput(text: string): TextOutput {
  const question_prompt = text.match(
    /<question_prompt>([\s\S]*?)<\/question_prompt>/,
  );
  const question_selections_1 = text.match(
    /<question_selections_1>([\s\S]*?)<\/question_selections_1>/,
  );
  const question_selections_2 = text.match(
    /<question_selections_2>([\s\S]*?)<\/question_selections_2>/,
  );
  const question_selections_3 = text.match(
    /<question_selections_3>([\s\S]*?)<\/question_selections_3>/,
  );
  const question_selections_4 = text.match(
    /<question_selections_4>([\s\S]*?)<\/question_selections_4>/,
  );
  const question_selections_5 = text.match(
    /<question_selections_5>([\s\S]*?)<\/question_selections_5>/,
  );
  const answer = text.match(/<answer>([\s\S]*?)<\/answer>/);
  const solution = text.match(/<solution>([\s\S]*?)<\/solution>/);

  if (question_prompt?.[1] == null) {
    throw new LlmFailure(
      `failed to parse the output; your response should contain a question prompt within <question_prompt> tags`,
    );
  }

  if (question_selections_1?.[1] == null) {
    throw new LlmFailure(
      `failed to parse the output; your response should contain a question selections within <question_selections_1> tags`,
    );
  }

  if (question_selections_2?.[1] == null) {
    throw new LlmFailure(
      `failed to parse the output; your response should contain a question selections within <question_selections_2> tags`,
    );
  }

  if (question_selections_3?.[1] == null) {
    throw new LlmFailure(
      `failed to parse the output; your response should contain a question selections within <question_selections_3> tags`,
    );
  }

  if (question_selections_4?.[1] == null) {
    throw new LlmFailure(
      `failed to parse the output; your response should contain a question selections within <question_selections_4> tags`,
    );
  }

  if (question_selections_5?.[1] == null) {
    throw new LlmFailure(
      `failed to parse the output; your response should contain a question selections within <question_selections_5> tags`,
    );
  }

  const question_selections: [string, string, string, string, string] = [
    question_selections_1[1].trim(),
    question_selections_2[1].trim(),
    question_selections_3[1].trim(),
    question_selections_4[1].trim(),
    question_selections_5[1].trim(),
  ];

  if (answer?.[1] == null) {
    throw new LlmFailure(
      `failed to parse the output; your response should contain an answer within <answer> tags`,
    );
  }

  if (solution?.[1] == null) {
    throw new LlmFailure(
      `failed to parse the output; your response should contain a solution within <solution> tags`,
    );
  }

  const answerString = answer[1].trim();
  const parsedAnswer = Number.parseInt(answerString);

  if (Number.isNaN(parsedAnswer)) {
    throw new LlmFailure(
      `failed to parse the output; your response should contain a valid selection number (1-5) within <answer> tags`,
    );
  }

  const integerAnswer = Math.floor(parsedAnswer);

  if (integerAnswer < 1 || integerAnswer > 5) {
    throw new LlmFailure(
      `failed to parse the output; your response should contain a valid selection number (1-5) within <answer> tags`,
    );
  }

  return {
    question_prompt: question_prompt[1].trim(),
    question_selections,
    answer: String(integerAnswer),
    solution: solution[1].trim(),
  };
}
