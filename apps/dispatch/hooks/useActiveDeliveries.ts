"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createBrowserClient } from "@rwc/db";
import { isActive } from "@rwc/shared";
import type { ActiveDelivery } from "../lib/mock-data";
import { getMockActiveDeliveries } from "../lib/mock-data";

/**
 * Fetches active deliveries from the API (Supabase-backed),
 * subscribes to realtime updates, and falls back to mock data
 * if no real orders exist.
 */
export function useActiveDeliveries() {
  const [deliveries, setDeliveries] = useState<ActiveDelivery[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);
  const supabaseRef = useRef<ReturnType<typeof createBrowserClient> | null>(
    null
  );

  // Lazy-init supabase so we don't crash if env vars are missing
  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) {
      try {
        supabaseRef.current = createBrowserClient();
      } catch {
        return null;
      }
    }
    return supabaseRef.current;
  }, []);

  // Fetch full list from API
  const fetchDeliveries = useCallback(async () => {
    try {
      const res = await fetch("/api/deliveries");
      if (!res.ok) throw new Error("API error");
      const data: ActiveDelivery[] = await res.json();
      return data;
    } catch {
      return null;
    }
  }, []);

  // Initial load
  useEffect(() => {
    async function load() {
      const data = await fetchDeliveries();
      if (data && data.length > 0) {
        setDeliveries(data);
        setUseMock(false);
      } else {
        // Fall back to mock data
        setDeliveries(getMockActiveDeliveries());
        setUseMock(true);
      }
      setIsLoading(false);
    }
    load();
  }, [fetchDeliveries]);

  // Realtime subscription — refetch on any order/assignment change
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    const channel = supabase
      .channel("dispatch-deliveries")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        async () => {
          // Refetch the full list when any order changes
          const data = await fetchDeliveries();
          if (data) {
            setDeliveries(data);
            if (data.length > 0) setUseMock(false);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "delivery_assignments" },
        async () => {
          const data = await fetchDeliveries();
          if (data) {
            setDeliveries(data);
            if (data.length > 0) setUseMock(false);
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [getSupabase, fetchDeliveries]);

  return { deliveries, isConnected, isLoading, useMock };
}
