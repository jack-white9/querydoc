import { LargeLanguageModel } from "./LargeLanguageModel";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

export class OpenAIChatCompletionModel extends LargeLanguageModel {
  async getGptResponse(
    query: string,
    context: string[]
  ): Promise<ChatCompletionRequestMessage> {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: super.buildPrompt(query, context),
    });

    return completion.data.choices[0].message;
  }
}
