// Minimal, copy-paste friendly test-mode helper.
// No env typings required, works with just a query param (?test=1) and optional JSON import.
import { useEffect, useMemo } from "react";
import type { TarotCard } from "@/data/tarotCards";

export type TestPayload = unknown;

export function isTestMode(): boolean {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.has("test")) {
      const v = (params.get("test") || "").toLowerCase();
      return v !== "0" && v !== "false" && v !== "";
    }
  }
  // Optional: Vite env flag if present, without typing requirements
  type ImportMetaMaybe = { env?: { VITE_TEST_MODE?: string } };
  const envFlag = (
    typeof import.meta !== "undefined"
      ? (import.meta as unknown as ImportMetaMaybe).env?.VITE_TEST_MODE
      : undefined
  ) as string | undefined;
  if (typeof envFlag === "string") {
    const v = envFlag.toLowerCase();
    return v === "1" || v === "true";
  }
  return false;
}

export function coerceMaybeStringifiedJson<T = unknown>(
  data: unknown,
): T | null {
  try {
    if (data == null) return null;
    if (typeof data === "string") {
      // Strip simple code fences and fix common over-escaping
      let cleaned = data.replace(/```(json)?\s*/gi, "").replace(/```/g, "");
      if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned.slice(1, -1);
      }
      cleaned = cleaned.replace(/\\"/g, '"').replace(/\\n/g, "\n");
      return JSON.parse(cleaned) as T;
    }
    if (typeof data === "object") return data as T;
    return null;
  } catch {
    return null;
  }
}

export function loadTestPayload<T = unknown>(
  maybeJsonModule: unknown,
): T | null {
  // Supports two shapes: { result: string|object } or a raw object/string
  const hasResult = (x: unknown): x is { result?: unknown } =>
    typeof x === "object" &&
    x !== null &&
    "result" in (x as Record<string, unknown>);
  const raw = hasResult(maybeJsonModule)
    ? maybeJsonModule.result
    : maybeJsonModule;
  return coerceMaybeStringifiedJson<T>(raw);
}

// React hook: apply test mode by loading payload and calling setState.
// Accepts a lazy getter for the payload module to avoid bundling when not needed.
export function useApplyTestMode<T>(options: {
  getPayload: () => unknown;
  onApply: (data: T) => void;
}): void {
  const enabled = useMemo(() => isTestMode(), []);
  useEffect(() => {
    if (!enabled) return;
    try {
      const parsed = loadTestPayload<T>(options.getPayload());
      if (parsed) options.onApply(parsed);
      else console.error("[test-mode] Failed to parse test payload");
    } catch (e) {
      console.error("[test-mode] Error applying test payload", e);
    }
  }, [enabled, options]);
}

// Minimal test deck to avoid DB dependency in test mode only
export function getTestTarotCards(): TarotCard[] {
  return [
    {
      id: "justice",
      name: "Justice",
      number: 11,
      arcana: "major",
      keywords: ["balance", "fairness", "truth"],
      meaning: {
        upright: "Fairness, truth, law, cause and effect",
        reversed: "Dishonesty, unfairness, lack of accountability",
      },
      symbolism: ["scales", "sword"],
      element: "Air",
      astrology: "Libra",
      image_url: "",
    },
    {
      id: "the-empress",
      name: "The Empress",
      number: 3,
      arcana: "major",
      keywords: ["abundance", "nurturing", "creativity"],
      meaning: {
        upright: "Femininity, beauty, nature, nurturing, abundance",
        reversed: "Dependence, smothering, emptiness",
      },
      symbolism: ["crown", "wheat"],
      element: "Earth",
      astrology: "Venus",
      image_url: "",
    },
    {
      id: "the-magician",
      name: "The Magician",
      number: 1,
      arcana: "major",
      keywords: ["manifestation", "resourcefulness", "power"],
      meaning: {
        upright: "Manifestation, resourcefulness, power, inspired action",
        reversed: "Manipulation, poor planning, untapped talents",
      },
      symbolism: ["wand", "table"],
      element: "Air",
      astrology: "Mercury",
      image_url: "",
    },
  ];
}
