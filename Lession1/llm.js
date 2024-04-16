import dotenv from 'dotenv'
dotenv.config();
import { ChatOpenAI } from '@langchain/openai'

const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-3.5-turbo',
    temperature: 0.5
})

const response = await model.invoke("What can you do?")

console.log(response)