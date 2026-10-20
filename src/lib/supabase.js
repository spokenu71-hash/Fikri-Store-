
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

function isValidSupabaseUrl(value) {
  if (!value) return false;

  try {
    const url = new URL(value);

    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export const supabaseConfigured = Boolean(
  isValidSupabaseUrl(supabaseUrl) && supabaseKey
);

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;
