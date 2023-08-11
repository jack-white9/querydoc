import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

type Prompt = { role: string; content: string };

const buildPrompt = (
  query: string,
  context: string[]
): ChatCompletionRequestMessage[] => {
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
};

export const getGptResponse = async (
  query: string,
  context: string[]
): Promise<ChatCompletionRequestMessage> => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  console.log("Generating AI response...");

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: buildPrompt(query, context),
  });

  return completion.data.choices[0].message;
};
