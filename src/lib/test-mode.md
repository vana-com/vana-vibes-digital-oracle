# Test Mode (copy-paste helper)

## What you get
- Toggle test data with `?test=1` (or `VITE_TEST_MODE=true`).
- Auto-loads `src/lib/test-result.json` and skips auth/widget.

## How to use
1) Copy `src/lib/test-mode.ts` and `src/lib/test-result.json` into your project.
2) In your page/component:
```ts
import testResult from '@/lib/test-result.json'
import { useApplyTestMode } from '@/lib/test-mode'

useApplyTestMode<AnalysisResult>({
  getPayload: () => testResult,
  onApply: setAnalysisResult,
})
```
3) Run with `?test=1` to jump straight to results.

## Notes
- Works without editing `vite-env.d.ts`.
- Optional env: `VITE_TEST_MODE=true` to force test mode.
