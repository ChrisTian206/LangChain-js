import * as dotenv from 'dotenv'
dotenv.config()

import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { createOpenAIFunctionsAgent, AgentExecutor } from 'langchain/agents'
import { TavilySearchResults } from '@langchain/community/tools/tavily_search'
import readline, { createInterface } from 'readline'
import { AIMessage, HumanMessage } from '@langchain/core/messages'

const model = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 1,
})

const prompt = ChatPromptTemplate.fromMessages([
    ("system", "You're a helpful study mentor called Alex."),
    new MessagesPlaceholder('chat_history'),
    ("human", "{input}"),
    new MessagesPlaceholder("agent_scratchpad")
])

const searchTool = new TavilySearchResults()
const tools = [searchTool]
const agent = await createOpenAIFunctionsAgent({
    llm: model,
    prompt,
    tools,
})

const agentExecutor = new AgentExecutor({
    agent,
    tools
})

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
})

const chatHistory = []

const chats = () => {
    rl.question("User: ", async (input) => {

        if (input.toLowerCase() === 'exit') {
            rl.close()
            return
        }

        const res = await agentExecutor.invoke({
            input: input,
            chat_history: chatHistory
        })

        console.log("Agent: ", res.output)
        chatHistory.push(new HumanMessage(input))
        chatHistory.push(new AIMessage(res.output))

        chats()
    })
}

chats()

