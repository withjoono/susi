export function serializeQuestion(
  questionPrompt: string,
  questionSelections:
    | [string, string, string, string, string]
    | undefined
    | null,
  answer: string,
  solution: string,
): string {
  const isObjectiveQuestion = questionSelections !== undefined;
  const questionSelectionList = `
  <question_selection_1>
  ${questionSelections?.[0]}
  </question_selection_1>

  <question_selection_2>
  ${questionSelections?.[1]}
  </question_selection_2>

  <question_selection_3>
  ${questionSelections?.[2]}
  </question_selection_3>

  <question_selection_4>
  ${questionSelections?.[3]}
  </question_selection_4>

  <question_selection_5>
  ${questionSelections?.[4]}
  </question_selection_5>
  `.trim();

  return `Here is the current question:

  <question_prompt>
  ${questionPrompt}
  </question_prompt>

  ${isObjectiveQuestion ? questionSelectionList : ""}

  <answer>
  ${answer}
  </answer>

  <solution>
  ${solution}
  </solution>
  `;
}
