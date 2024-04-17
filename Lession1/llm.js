import dotenv from 'dotenv'
dotenv.config();
import { ChatOpenAI } from '@langchain/openai'

const model = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0.5 //parameter for adjusting creativeness
    //maxToken
    //verbose (true/false, great for dev and debugging)
})

const response = await model.invoke("What can you do?")

/**
 * There are also other ways of calling the model.
 * 2. await model.batch(['question1', 'question2']), this allows several messages sent to AI and get several response back
 * The response would be multiple AIMessages
 * 
 * 3. await model.stream('question'), this would get response word by word
 * 
 * for await (const chunk of response){
 *  console.log(chunk?.content)
 * }
 * 
 * 4. await model.streamLog('question'), this would return not only the AIMessageChunk, but also other  info
 * 
 *   for await (const chunk of response){
 *      console.log(chunk?.content)
 *  }
 * 
 * The response would be a large lists of :
 * RunLogPatch {
  ops: [
    { op: 'add', path: '/streamed_output/-', value: [AIMessageChunk] }
  ]
}
 */

console.log(response)

/**AIMessage {
  lc_serializable: true,
  lc_kwargs: {
    content: 'I am an AI assistant trained to help answer questions, provide information, and engage in conversation. I can assist with a wide range of topics, such as general knowledge, recommendations, problem-solving, and more. Feel free to ask me anything, and I will do my best to assist you!',
    tool_calls: [],
    invalid_tool_calls: [],
    additional_kwargs: { function_call: undefined, tool_calls: undefined },
    response_metadata: {}
  },
  lc_namespace: [ 'langchain_core', 'messages' ],
  content: 'I am an AI assistant trained to help answer questions, provide information, and engage in conversation. I can assist with a wide range of topics, such as general knowledge, recommendations, problem-solving, and more. Feel free to ask me anything, and I will do my best to assist you!',
  name: undefined,
  additional_kwargs: { function_call: undefined, tool_calls: undefined },
  response_metadata: {
    tokenUsage: { completionTokens: 59, promptTokens: 12, totalTokens: 71 },
    finish_reason: 'stop'
  },
  tool_calls: [],
  invalid_tool_calls: []
} */