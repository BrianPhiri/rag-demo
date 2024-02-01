import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";

import { RedisVectorStore } from "@langchain/community/vectorstores/redis";

import { createClient } from "redis";

const client = createClient({
  password: "",
  socket: {
    host: "",
    port: 11899,
  },
});

await client.connect();

const vectorStore = new RedisVectorStore(
  new OpenAIEmbeddings({
    openAIApiKey: "",
  }),
  {
    redisClient: client,
    indexName: "docs",
  },
);

const model = new OpenAI();

const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(1), {
  returnSourceDocuments: true,
});
const chainRes = await chain.call({
  query:
    "ISSUE OF A NEW LAND TITLE DEED under Ezekiel Indeche Aluhoyo. The output should start with 'GAZETTE NOTICE till 'Dated''",
});
console.log(chainRes);

await client.disconnect();
