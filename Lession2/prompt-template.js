import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import * as dotenv from 'dotenv'


dotenv.config()

const model = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0.5
})

const prompt = ChatPromptTemplate.fromTemplate('You are a joke teller. Tell me a joke based on the following topic {input}')

/**
 * const prompt = ChatPromptTemplate.fromMessages([
  ["system", 'You are a joke teller. Tell me a joke based on the topic given by the user'],
  ["human", "{input}"],
]);
 */

const chain = prompt.pipe(model)

const res = await chain.invoke({
    input: 'husky'
})

console.log(res)