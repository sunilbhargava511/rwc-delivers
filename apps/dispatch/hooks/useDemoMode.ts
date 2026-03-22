"use client";

import { useState, useEffect, useCallback } from "react";
import { DEMO_MODE_KEY, DEMO_MODE_DEFAULT, setDemoMode as writeDemoMode } from "@rwc/shared";

export function useDemoMode() {
  const [enabled, setEnabled] = useState(DEMO_MODE_DEFAULT);

  useEffect(() => {
    // Read initial value
    try {
      const stored = localStorage.getItem(DEMO_MODE_KEY);
      setEnabled(stored === null ? DEMO_MODE_DEFAULT : stored === "true");
    } catch {}

    // Listen for changes from other tabs/apps
    const handler = (e: StorageEvent) => {
      if (e.key === DEMO_MODE_KEY) {
        setEnabled(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      writeDemoMode(next);
      return next;
    });
  }, []);

  const set = useCallback((value: boolean) => {
    setEnabled(value);
    writeDemoMode(value);
  }, []);

  return { demoMode: enabled, toggleDemoMode: toggle, setDemoMode: set };
}
