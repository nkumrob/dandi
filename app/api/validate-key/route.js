import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Extract API key from request body
    const { apiKey } = await request.json();

    // Query database to check if API key exists
    const { data, error } = await supabase
      .from("api_keys")
      .select("id") // We only need the id to verify existence
      .eq("key", apiKey)
      .single(); // We expect only one matching key

    // Return 401 if key is invalid or not found
    if (error || !data) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Return success if key is valid
    return NextResponse.json({ success: true });
  } catch (error) {
    // Log server errors and return 500
    console.error("Error validating API key:", error);
    return NextResponse.json(
      { error: "Failed to validate API key" },
      { status: 500 }
    );
  }
}
