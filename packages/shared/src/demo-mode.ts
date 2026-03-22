/**
 * Demo mode shared utilities.
 * localStorage key "rwc-demo-mode" syncs across all 3 apps.
 * Default: true (demo mode ON) since no database is connected yet.
 */

export const DEMO_MODE_KEY = "rwc-demo-mode";
export const DEMO_MODE_DEFAULT = true;

/** Read demo mode flag (safe for SSR — returns default) */
export function isDemoMode(): boolean {
  if (typeof window === "undefined") return DEMO_MODE_DEFAULT;
  try {
    const stored = localStorage.getItem(DEMO_MODE_KEY);
    if (stored === null) return DEMO_MODE_DEFAULT;
    return stored === "true";
  } catch {
    return DEMO_MODE_DEFAULT;
  }
}

/** Write demo mode flag */
export function setDemoMode(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DEMO_MODE_KEY, String(enabled));
    // Dispatch storage event so other tabs/apps pick it up
    window.dispatchEvent(new StorageEvent("storage", { key: DEMO_MODE_KEY, newValue: String(enabled) }));
  } catch {}
}
