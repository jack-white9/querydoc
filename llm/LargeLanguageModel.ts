import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";

// params may need to be adjusted to accomodate for new models
export abstract class LargeLanguageModel {
  buildPrompt(
    query: string,
    context: string[]
  ): ChatCompletionRequestMessage[] {
    const system = {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: `I am going to ask you a question, which I would like you to answer
              based only on the provided context, and not any other information.
              If there is not enough information in the context to answer the question,
              say "I am not sure", then try to make a guess.
              Break your answer up into nicely readable paragraphs.`,
    };
    const user = {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: `The question is ${query}. Here is all the context you have: ${context.join(
        " "
      )}`,
    };

    return [system, user];
  }
}
