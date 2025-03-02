import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { summarizeRepository } from "./chain";

// Function to fetch README content from GitHub
async function fetchGitHubReadme(githubUrl) {
  try {
    console.log("🔍 Starting README fetch for URL:", githubUrl);
    const urlParts = githubUrl.split("github.com/")[1].split("/");
    const owner = urlParts[0];
    const repo = urlParts[1];
    console.log("📂 Extracted owner:", owner, "repo:", repo);

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
    console.log("🔗 Generated API URL:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3.raw",
        "User-Agent": "Dandi-App",
      },
    });

    console.log("📥 GitHub API Response Status:", response.status);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch README: ${response.status} ${response.statusText}`
      );
    }

    const readmeContent = await response.text();
    console.log(
      "📄 README Content Length:",
      readmeContent.length,
      "characters"
    );
    return readmeContent;
  } catch (error) {
    console.error("❌ Error fetching README:", error);
    throw new Error(`Failed to fetch README: ${error.message}`);
  }
}

async function validateApiKey(apiKey) {
  try {
    console.log("🔑 Validating API key:", apiKey.substring(0, 8) + "...");
    const { data, error } = await supabase
      .from("api_keys")
      .select("id")
      .eq("key", apiKey)
      .single();

    if (error) {
      console.error("❌ Supabase validation error:", error);
      return false;
    }
    console.log("✅ API key validation result:", !!data);
    return !!data;
  } catch (error) {
    console.error("❌ API key validation error:", error);
    return false;
  }
}

export async function POST(request) {
  console.log("\n🚀 Starting new GitHub summarizer request");
  try {
    // Get API key from header
    const apiKey = request.headers.get("x-api-key");
    console.log("🔑 API Key present in headers:", !!apiKey);

    if (!apiKey) {
      console.log("❌ No API key provided in header");
      return NextResponse.json(
        { error: "API key is required in x-api-key header" },
        { status: 401 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log("📦 Received request body:", {
        ...body,
        githubUrl: body.githubUrl
          ? `${body.githubUrl.substring(0, 30)}...`
          : undefined,
      });
    } catch (error) {
      console.error("❌ Error parsing request body:", error);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate request body
    if (!body?.githubUrl || typeof body.githubUrl !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing GitHub URL" },
        { status: 400 }
      );
    }

    // Validate the API key
    console.log("🔑 Validating API key");
    const isValidKey = await validateApiKey(apiKey);
    if (!isValidKey) {
      console.log("❌ Invalid API key");
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Validate GitHub URL format
    try {
      const url = new URL(body.githubUrl);
      if (!url.hostname.includes("github.com")) {
        return NextResponse.json(
          { error: "URL must be from github.com domain" },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Fetch README content
    console.log("📚 Fetching README content");
    const readmeContent = await fetchGitHubReadme(body.githubUrl);
    console.log("✅ README fetched successfully");

    // Generate summary using the chain
    console.log("🤖 Generating repository summary");
    const summary = await summarizeRepository(readmeContent);
    console.log("✅ Summary generated successfully");

    // Return the structured summary
    return NextResponse.json(summary);
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
