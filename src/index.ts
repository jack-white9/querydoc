#! /usr/bin/env node
import chalk from "chalk";
import { program } from "commander";
import { QueryResponse } from "chromadb/dist/main/types";
import { OpenAIChatCompletionModel } from "./llm/OpenAIChatCompletionModel";
import { Chroma } from "./vectordb/Chroma";

const main = async (): Promise<void> => {
  const chroma = new Chroma();
  const collection = await chroma.createCollection();
  await chroma.addDocsToCollection(
    "documents/state_of_the_union.txt",
    collection
  );
  const results: QueryResponse = await chroma.queryDocs(collection);
  const llm = new OpenAIChatCompletionModel();
  const response = await llm.getGptResponse(
    "Which country does this document concern?",
    results.documents[0]
  );
  console.log(response.content);
};

program.command("test").description("Run a test command.").action(main);
program.parse();
