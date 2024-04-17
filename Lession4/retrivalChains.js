import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { Document } from '@langchain/core/documents'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { OpenAIEmbeddings } from "@langchain/openai";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import * as dotenv from 'dotenv'
import { load } from "cheerio";
dotenv.config();


const model = new ChatOpenAI({
    model: 'gpt-3.5-turbo',
    temperature: 0.5,
})

//user's input have to be named as input for retrival chains
const prompt = ChatPromptTemplate.fromTemplate(`
    answer the user's question: 
    Context: {context}
    Question: {input}`)

//const chain = prompt.pipe(model)
//To provide context, we need to user other chains
const chain = await createStuffDocumentsChain({
    llm: model,
    prompt
})

const loader = new CheerioWebBaseLoader(`https://langley.weatherstats.ca/`)

const docs = await loader.load()

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20
})

const spliitedDocs = await splitter.splitDocuments(docs)
//console.log(spliitedDocs) //would return an array of Document object which has pageContent and metadata
// const documentA = new Document({
//     pageContent: `Today's weather is Sunny, temperature ranged from 2 degree C to 14 degree C, light wind`
// })

//But to aviod sending useless info to OpenAI, use techniques to select relavant info using Vector Embeddings.
const embeddings = new OpenAIEmbeddings()

const vectorstores = await MemoryVectorStore.fromDocuments(
    spliitedDocs,
    embeddings
)

// Create a retriever from vector store
// When we invoke chain, it will go into store to select the most relevant k documents
const retriever = vectorstores.asRetriever({ k: 2 });

const retrievalChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever
})
const res = await retrievalChain.invoke({ input: 'What is today weather?' })


//const res = await chain.invoke({ input: 'What is today weather?', context: docs })
console.log(res)

//output w/o context: "I'm sorry, I am not able to provide real-time weather updates. You can check the weather forecast on a weather website or app for the most up-to-date information.",
//output w context from documentA: Today's weather is sunny with temperatures ranging from 2 degrees Celsius to 14 degrees Celsius and light winds.
//output w cheerioWebBaseLoader: To find out today's weather in Langley, you can customize the dashboard by selecting Langley as your location. Once you have done that, you will be able to see the current conditions, forecast, and any alerts for Langley. Remember to refer to the official Environment and Climate Change Canada data for the most accurate information.