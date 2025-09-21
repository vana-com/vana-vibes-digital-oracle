# Productionising Summary

This doc summarizes the changes made to align the new design with the legacy working system, ensuring production readiness. Focus was on simplicity, removing overhead, and explicit data flow.

## Data Flow Standardization

- All data passing (from Landing to Reading) now uses sessionStorage only.
- `handleAccept` calls `onDataConnect(payload)` to write storage, then navigates.
- Removed router state fallback in Reading.tsx for one simple path (refresh-resilient).

## Redirect Authority

- Reading.tsx is the single authority for redirects (if no data).
- TarotReading no longer navigates; if data is missing, it returns early (trusts parent).

## Test-Mode Removal

- Removed new `isTestMode` gates, helpers, and files (test-mode.ts/md/json).
- Revert to legacy mock system: seed sessionStorage for testing.

## Share Gating Restore

- "Share to LinkedIn" buttons appear only when all cards are `isRevealed && isCompleted` (after ScrambleText finishes).

## Explicit Decks Refactor

- `useTarotCards` returns `{ loading, error, decks }` explicitly.
- `selectCardsBasedOnData` requires `decks` param (no global arrays).
- Removed mutable module-level decks from data/tarotCards.ts.

## Domain Library Restructure

- Moved to co-located libs:
  - `lib/card-selection/` (types, hook, select, map, barrel).
  - `lib/readings/` (generator, barrel).
- Updated imports to use barrels (e.g., `from '@/lib/card-selection'`).
- Added compatibility re-exports at old utils paths; can delete later.

These changes reduce complexity, eliminate hidden state, and match legacy behavior while supporting the new design. No known regressions.

# LAST WORK

I'll create a short implementation todo list and start applying the edits now.

[1 tool called]

I'll start by updating the todo list and then apply the edits across the files, removing the test-mode system and standardizing on sessionStorage.

[2 tools called]

I'll make Reading the redirect authority by removing navigation in TarotReading when linkedinData is missing, then remove test-mode gates from useTarotCards, readingGenerator, and TarotReading, and simplify share gating to only depend on isRevealed. Finally, I'll delete the test-mode files.

[15 tools called]

Pushing forward: I updated `handleAccept` to use sessionStorage via `onDataConnect`, made `Reading` the redirect authority by removing navigation from `TarotReading`, removed all new test-mode gates and files, and simplified share gating to depend only on reveal. I'll run a quick lint check on the modified files and fix any issues.

[1 tool called]

- I updated the todo list and executed the edits.

What I changed

- `Landing.tsx`
  - `handleAccept` now standardizes on sessionStorage by calling `onDataConnect(payload)` then `navigate('/reading')`. No router state.
  - VanaWidget import left commented; you already fixed it.
- `TarotReading.tsx`
  - Removed `isTestMode` import/usage and all test gating.
  - Removed self-redirect; if `linkedinData` is missing it returns early and lets `Reading` own redirect.
  - Keeps new `CareerFortuneLoading` and shows it whenever `isGeneratingReadings` is true.
  - Simplified share gating: it appears once all cards are revealed (no ScrambleText completion gating).
- `useTarotCards.ts`
  - Removed test-mode branch; always populates cards from DB as before.
- `readingGenerator.ts`
  - Removed test-mode early-return; always calls Supabase function (fallback remains).
- Deleted test-mode files
  - `src/lib/test-mode.ts`
  - `src/lib/test-mode.md`
  - `src/lib/test-result.json`

Lint

- One warning in `Landing.tsx`: `useCallback` missing dependency `onDataConnect`. It’s safe to ignore or add it to deps. Leaving as-is to avoid churn, since parent passes a stable function in your current app.

Sanity pass you can try

- From `/`, click Accept: data is written to sessionStorage; `/reading` loads and works on refresh.
- When Vana is re-enabled, it should call `onDataConnect` and navigate; same behavior.
- Cards load (DB), generate readings (Supabase), loader shows during generation, share appears after revealing all three.

All todo items completed.

- Standardized data flow via sessionStorage.
- Reading is the sole redirect authority.
- Removed the new test-mode system and gates.
- Kept the new loader.
- Simplified share gating.

Want me to add `onDataConnect` to the `useCallback` deps to silence the warning, or leave it?

## Note: import.meta.env.DEV (Vite)

- `import.meta.env.DEV` is a boolean injected by Vite. It is `true` only during local dev or when the build runs in development mode.
- We now use it in `Landing.tsx` to decide which Vana origin to target. This prevents accidental use of `dev.app.vana.com` on production deployments that happen to be on a `vercel.app` hostname.
- TL;DR: If `import.meta.env.DEV` is true (local dev), or hostname is `dev.*` or `localhost`, we use `https://dev.app.vana.com`; otherwise `https://app.vana.com`.
