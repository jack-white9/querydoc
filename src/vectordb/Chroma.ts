import { ChromaClient, Collection, OpenAIEmbeddingFunction } from "chromadb";
import { CollectionType, QueryResponse } from "chromadb/dist/main/types";
import { readDocument, chunkString } from "../util/documents";

export class Chroma {
  async createCollection(): Promise<Collection> {
    require("dotenv").config();
    const client = new ChromaClient();
    const embedder = new OpenAIEmbeddingFunction({
      openai_api_key: process.env.OPENAI_API_KEY,
    });

    const existingCollections: CollectionType[] =
      await client.listCollections();
    if (existingCollections.length) {
      await client.deleteCollection({ name: "document_collection" });
    }

    const collection = await client.createCollection({
      name: "document_collection",
      embeddingFunction: embedder,
    });
    return collection;
  }

  async addDocsToCollection(
    documentPath: string,
    collection: Collection
  ): Promise<void> {
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
  }

  async queryDocs(
    collection: Collection,
    query: string
  ): Promise<QueryResponse> {
    const results = await collection.query({
      nResults: 5,
      queryTexts: [query],
    });
    return results;
  }
}
