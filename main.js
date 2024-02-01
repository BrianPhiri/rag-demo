import { ChatOpenAI } from "@langchain/openai";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { RedisVectorStore } from "@langchain/community/vectorstores/redis";
import { OpenAIEmbeddings } from "@langchain/openai";

import { createClient } from "redis";

const model = new ChatOpenAI({
  openAIApiKey: "",
});

const client = createClient({
  password: "",
  socket: {
    host: "",
    port: 11899,
  },
});

await client.connect();
const loader = new PDFLoader(
  "ke-government-gazette-dated-2023-09-08-no-200.pdf",
  {
    splitPages: false,
  },
);

const docs = await loader.load();
const textSplitter = new RecursiveCharacterTextSplitter({
  chuckSize: 10,
  chuckOverlap: 5,
});
const splitDoc = await textSplitter.splitDocuments(docs);

console.log({ splitDoc });

const vectorStore = await RedisVectorStore.fromDocuments(
  splitDoc,
  new OpenAIEmbeddings({
    openAIApiKey: "",
  }),
  {
    redisClient: client,
    indexName: "docs",
  },
);

await client.disconnect();
