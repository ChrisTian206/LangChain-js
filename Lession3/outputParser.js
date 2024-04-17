//https://js.langchain.com/docs/modules/model_io/output_parsers/types/

/**
 * This session we will learn different types of parser. 
 * Without parser, we would get response back like this: 
 *   content: 'Why did the husky refuse to play hide and seek?\n' +
    '\n' +
    'Because he was always spotted!',
 * But we don't always want the \n there.
 * After applying a parser, StringOutputParser, the response become like this: (simply a string)
 * Why did the husky bring a flashlight to the party? 
    Because he heard it was going to be a "bark" night!
 */

import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser, CommaSeparatedListOutputParser, StructuredOutputParser } from '@langchain/core/output_parsers'
import * as dotenv from 'dotenv'
import { z } from 'zod'
dotenv.config()

//1. select model and setup params
const model = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0.5
})


const callStringOutputParser = async () => {


    //2. Create a prompt template
    const prompt = ChatPromptTemplate.fromTemplate('You are a joke teller. Tell me a joke based on the following topic {input}')

    /**
     * const prompt = ChatPromptTemplate.fromMessages([
      ["system", 'You are a joke teller. Tell me a joke based on the topic given by the user'],
      ["human", "{input}"],
    ]);
     */

    //Create Parser
    const parser = new StringOutputParser()

    //3. Create chain
    const chain = prompt.pipe(model).pipe(parser)

    //4. Call chain
    return await chain.invoke({
        input: 'husky'
    })
}

const callListOutputParser = async () => {
    const prompt = ChatPromptTemplate.fromTemplate('give me 3 synonums for the word {input}')

    const parser = new CommaSeparatedListOutputParser()

    const chain = prompt.pipe(model).pipe(parser)

    return await chain.invoke({ input: 'happy' })
}

//const res = await callStringOutputParser();
//output: Why did the husky bring a flashlight to the party? 
//Because he heard it was going to be a "bark" night!

//const res = await callListOutputParser();
//output: [ '1. Joyful\n2. Delighted\n3. Content' ]

async function callStructuredParser() {
    const prompt = ChatPromptTemplate.fromTemplate(`
        Extract information from the following phrase.
        Formatting Instructions: {format_instructions}
        Phrase: {phrase}
    `);

    const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
        name: "name of the person",
        age: "age of person",
    });

    const chain = prompt.pipe(model).pipe(outputParser);

    return await chain.invoke({
        phrase: "Jojo is 2 and half years old",
        format_instructions: outputParser.getFormatInstructions(),
    });
}


//using zod, you can specify data type
async function callZodStructuredParser() {
    const prompt = ChatPromptTemplate.fromTemplate(`
        Extract information from the following phrase.
        Formatting Instructions: {format_instructions}
        Phrase: {phrase}
    `);
    const outputParser = StructuredOutputParser.fromZodSchema(
        z.object({
            recipe: z.string().describe("name of recipe"),

            ingredients: z.array(z.string()).describe("ingredients"),
        })
    );

    // Create the Chain
    const chain = prompt.pipe(model).pipe(outputParser);

    return await chain.invoke({
        phrase:
            "The ingredients for a Spaghetti Bolognese recipe are tomatoes, minced beef, garlic, wine and herbs.",
        format_instructions: outputParser.getFormatInstructions(),
    });
}

//const res = await callStructuredParser()
//output: { name: 'Jojo', age: '2 and half years old' }

const res = await callZodStructuredParser()
/**
 * output: 
 * {
  recipe: 'Spaghetti Bolognese',
  ingredients: [ 'tomatoes', 'minced beef', 'garlic', 'wine', 'herbs' ]
    }
 */
console.log(res)