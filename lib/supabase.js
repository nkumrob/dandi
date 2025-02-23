import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined"
  );
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`);
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export async function testConnection() {
  try {
    const { data, error } = await supabase.from("api_keys").select("count");
    if (error) {
      console.error("Database connection test failed:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Database connection test failed:", error);
    return false;
  }
}
