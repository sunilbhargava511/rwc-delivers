import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function getSupabaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL environment variable. " +
        "Set it in your .env.local file or deployment environment."
    );
  }
  return value;
}

function getSupabaseAnonKey(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!value) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. " +
        "Set it in your .env.local file or deployment environment."
    );
  }
  return value;
}

// Browser client (used in client components)
export function createBrowserClient() {
  return createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey());
}

// Server client (used in server components and API routes)
export function createServerClient() {
  return createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      persistSession: false,
    },
  });
}

// Service role client (bypasses RLS — use only in server-to-server contexts like webhooks)
export function createServiceRoleClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY environment variable. " +
        "Required for webhook handlers and service-to-service operations."
    );
  }
  return createClient<Database>(getSupabaseUrl(), serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
