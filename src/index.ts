#! /usr/bin/env node
import chalk from "chalk";
import { program } from "commander";
import { QueryResponse } from "chromadb/dist/main/types";
import { OpenAIChatCompletionModel } from "./llm/OpenAIChatCompletionModel";
import { Chroma } from "./vectordb/Chroma";
import { readFilesInDirectory } from "./util/documents";
import cliProgress from "cli-progress";

const main = async (query: string, dir: string): Promise<void> => {
  const progressBar = new cliProgress.SingleBar({
    format: "Loading documents... ({value}/{total}) | {bar} | {percentage}%",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
    clearOnComplete: true,
  });
  const chroma = new Chroma();
  const collection = await chroma.createCollection();
  const files = readFilesInDirectory(dir);

  const fileCountInDirectory: number = files.length;

  progressBar.start(fileCountInDirectory, 0);
  for (let i = 0; i < files.length; i++) {
    await chroma.addDocsToCollection(files[i], collection);
    progressBar.increment(1);
  }

  const results: QueryResponse = await chroma.queryDocs(collection, query);
  const llm = new OpenAIChatCompletionModel();
  const response = await llm.getGptResponse(query, results.documents[0]);

  progressBar.stop();
  console.log(chalk.yellow(response.content));
};

program
  .command("query <string>")
  .description("Query the documents in a specified directory.")
  .requiredOption("-d, --dir <directory>", "Specify the document directory")
  .action((query, options) => main(query, options.dir));
program.parse();
