## Why

The promotions cache currently accumulates stale entries because promotions that disappear from the source site are never removed. This causes the cache to diverge from the current site state and can suppress or mis-handle notification behavior over time.

## What Changes

- Add cache reconciliation during promotions scraping so cached promotions not present in the latest scrape are removed.
- Keep duplicate-notification prevention for active promotions, while ensuring only current promotions remain in cache.
- Persist the cleaned cache state as part of the same promotions update flow.

## Capabilities

### New Capabilities
- `promotions-cache-cleanup`: Reconciles cached promotions with the latest scrape and removes outdated entries.

### Modified Capabilities


## Impact

- Affects promotions scraping and cache update logic in the promotions workflow (including `promotions.ts`).
- No external API changes expected.
- No new dependencies expected.
