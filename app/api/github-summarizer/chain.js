import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

// Define the output schema using Zod
const OutputSchema = z.object({
  summary: z
    .string()
    .describe("A concise summary of what the repository is about"),
  coolFacts: z
    .array(z.string())
    .describe("List of interesting technical details or notable features"),
});

// Create the prompt template
const prompt = PromptTemplate.fromTemplate(
  "Analyze the following GitHub repository README content and provide a structured summary.\n\n" +
    "README Content:\n{readmeContent}\n\n" +
    "Provide a concise summary of the repository and extract interesting facts or features.\n" +
    "The summary should give an overview of what the repository is about.\n" +
    "The cool facts should be a list of interesting technical details, unique features, or notable aspects."
);

// Initialize the model with structured output
const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
}).withStructuredOutput(OutputSchema);

// Create the chain
export const createSummaryChain = () => {
  return RunnableSequence.from([
    {
      readmeContent: (input) => input.readmeContent,
    },
    prompt,
    model,
  ]);
};

// Helper function to run the chain
export async function summarizeRepository(readmeContent) {
  try {
    console.log("🔄 Creating summary chain");
    const chain = createSummaryChain();

    console.log(
      "📝 Invoking chain with README content length:",
      readmeContent.length
    );
    const response = await chain.invoke({
      readmeContent,
    });

    console.log("✅ Chain execution successful");
    return {
      success: true,
      ...response,
    };
  } catch (error) {
    console.error("❌ Error in summarization chain:", error);
    throw new Error(`Failed to summarize repository: ${error.message}`);
  }
}
