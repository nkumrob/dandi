import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { chatModel } from "@/lib/langchain";

async function validateApiKey(apiKey) {
  const { data, error } = await supabase
    .from("api_keys")
    .select("id")
    .eq("key", apiKey)
    .single();

  if (error || !data) {
    return false;
  }
  return true;
}

export async function POST(request) {
  try {
    // Extract API key and GitHub URL from request body
    const { apiKey, githubUrl } = await request.json();

    // Validate the API key
    const isValidKey = await validateApiKey(apiKey);
    if (!isValidKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Basic URL validation
    if (!githubUrl || !githubUrl.includes("github.com")) {
      return NextResponse.json(
        { error: "Invalid GitHub URL" },
        { status: 400 }
      );
    }

    // Create a prompt for the GitHub repository analysis
    const prompt = `Please analyze this GitHub repository: ${githubUrl}
    Provide a brief summary including:
    1. Main purpose of the repository
    2. Key features
    3. Technologies used
    Please keep the response concise and informative.`;

    // Get the summary from the AI model
    const response = await chatModel.invoke(prompt);

    // Return the summary
    return NextResponse.json({
      success: true,
      summary: response.content,
    });
  } catch (error) {
    console.error("Error in GitHub summarizer:", error);
    return NextResponse.json(
      { error: "Failed to process GitHub repository" },
      { status: 500 }
    );
  }
}
