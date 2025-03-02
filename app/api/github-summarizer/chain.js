import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Create the prompt template with a simpler structure
const prompt =
  PromptTemplate.fromTemplate(`You are a GitHub repository analyzer. Analyze the following README content and provide a summary.

README Content:
{readmeContent}

Format your response as a JSON object with:
1. A "summary" field containing a concise overview
2. A "coolFacts" array listing interesting technical details

Keep your response focused and ensure it is valid JSON.`);

// Custom parser to handle the response
const customParser = {
  parse: async (text) => {
    try {
      console.log("📝 Raw response:", text);

      // Handle different response formats
      let content;
      if (typeof text === "object" && text.content) {
        content = text.content;
      } else if (typeof text === "string") {
        content = text;
      } else {
        throw new Error("Unexpected response format");
      }

      // Parse the JSON content
      const parsed = JSON.parse(content);
      console.log("✅ Successfully parsed JSON:", parsed);

      // Validate the structure
      if (!parsed.summary || !Array.isArray(parsed.coolFacts)) {
        throw new Error("Invalid response structure");
      }

      return parsed;
    } catch (error) {
      console.error("❌ Parsing error:", error);
      return {
        summary: "Failed to parse repository content",
        coolFacts: ["Error processing repository details"],
      };
    }
  },
};

// Create the chain
export const createSummaryChain = () => {
  // Initialize the model inside the function
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
  }).bind({
    response_format: { type: "json_object" },
  });

  return RunnableSequence.from([
    {
      readmeContent: (input) => input.readmeContent,
    },
    prompt,
    model,
    customParser,
  ]);
};

// Helper function to run the chain
export async function summarizeRepository(readmeContent) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not found in environment variables");
    }

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
