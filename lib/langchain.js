import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

// Initialize the OpenAI model
export const chatModel = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Create a basic prompt template
export const researchPrompt = new PromptTemplate({
  template: "Analyze the following research topic: {topic}",
  inputVariables: ["topic"],
});
