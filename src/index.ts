#! /usr/bin/env node
import chalk from "chalk";
import { program } from "commander";
import { QueryResponse } from "chromadb/dist/main/types";
import { OpenAIChatCompletionModel } from "./llm/OpenAIChatCompletionModel";
import { Chroma } from "./vectordb/Chroma";
import { readFilesInDirectory } from "./util/documents";

const main = async (query: string): Promise<void> => {
  const chroma = new Chroma();
  const collection = await chroma.createCollection();
  console.log(readFilesInDirectory("documents/"));
  await chroma.addDocsToCollection(
    "documents/state_of_the_union.txt",
    collection
  );
  const results: QueryResponse = await chroma.queryDocs(collection, query);
  const llm = new OpenAIChatCompletionModel();
  const response = await llm.getGptResponse(query, results.documents[0]);
  console.log(response.content);
};

program
  .command("query <string>")
  .description("Run a test command.")
  .action((query) => main(query));
program.parse();
