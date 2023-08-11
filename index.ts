#! /usr/bin/env node

import { program } from "commander";
import { ChromaClient, Collection, OpenAIEmbeddingFunction } from "chromadb";
import chalk from "chalk";
import fs from "fs";
import { CollectionType, QueryResponse } from "chromadb/dist/main/types";

const createCollection = async (): Promise<Collection> => {
  require("dotenv").config();
  const client = new ChromaClient();
  const embedder = new OpenAIEmbeddingFunction({
    openai_api_key: process.env.OPENAI_API_KEY,
  });

  const existingCollections: CollectionType[] = await client.listCollections();
  if (existingCollections.length) {
    console.log("Deleting existing collection");
    await client.deleteCollection({ name: "document_collection" });
  }

  const collection = await client.createCollection({
    name: "document_collection",
    embeddingFunction: embedder,
  });
  return collection;
};

const readDocument = (path: string): string => {
  try {
    const documentText = fs.readFileSync(path);
    return documentText.toString();
  } catch (error) {
    console.log(`Error: ${error.stack}`);
    return "";
  }
};

const chunkString = (string: string, length: number) => {
  return string.match(new RegExp(".{1," + length + "}", "g"));
};

const addDocsToCollection = async (
  documentPath: string,
  collection: Collection
): Promise<void> => {
  const document: string = readDocument(documentPath);
  const chunkedDocument: string[] = chunkString(document, 100);

  // TODO: clean this up
  const documentChunkIds = [];
  for (let i = 0; i < chunkedDocument.length; i++) {
    documentChunkIds.push(i.toString());
  }

  await collection.add({
    ids: documentChunkIds,
    documents: chunkedDocument,
  });
};

const queryDocs = async (collection: Collection): Promise<QueryResponse> => {
  const results = await collection.query({
    nResults: 2,
    queryTexts: ["Which country does this document concern?"],
  });
  return results;
};

const main = async (): Promise<void> => {
  const collection = await createCollection();
  await addDocsToCollection("documents/state_of_the_union.txt", collection);
  const results: QueryResponse = await queryDocs(collection);
  console.log(results);
};

program.command("test").description("Run a test command.").action(main);
program.parse();
