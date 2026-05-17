## Context

The promotions workflow loads cached promotions, scrapes each configured site, sends notifications for newly discovered promotions, and then writes a refreshed cache. Today, when a site scrape yields no promotions, the flow treats that outcome the same as a scrape error and keeps the cached promotions for that site. This prevents stale entries from being removed when promotions legitimately expire.

The change needs to preserve the current safety behavior for actual scrape failures while allowing cache cleanup when a scrape succeeds with zero or fewer promotions than before.

## Goals / Non-Goals

**Goals:**
- Remove stale promotions from cache when they are no longer present in a successful scrape result.
- Preserve notification deduplication so only truly new promotions are notified.
- Avoid deleting cached promotions when scraping fails due to network or parsing errors.

**Non-Goals:**
- Changing promotion ID generation logic.
- Modifying Discord notification payloads or rate limiting behavior.
- Adding new storage backends or cache formats.

## Decisions

- Distinguish scrape outcomes between `success` and `failure` instead of using only an array return value.
  - Rationale: an empty array can represent a valid state (no active promotions) and should not be treated as an error.
  - Alternative considered: keep array return type and infer failure from side effects/logs. Rejected as ambiguous and fragile.

- On successful scrape, replace that site's cached promotions with the current scrape output (including empty output).
  - Rationale: replacement naturally removes outdated entries and keeps cache aligned with source-of-truth state.
  - Alternative considered: explicit stale-ID diff then delete. Rejected as more complex with no functional gain over replacement.

- On scrape failure, preserve existing cached promotions for that site.
  - Rationale: prevents accidental data loss caused by temporary fetch or parsing failures.
  - Alternative considered: clear cache on any failure. Rejected because it can cause false churn and repeated notifications when service recovers.

## Risks / Trade-offs

- [Risk] A scraper bug that returns an empty successful result can clear valid cached promotions. -> Mitigation: keep explicit error signaling from scrapers and preserve existing error handling logs.
- [Risk] Behavior change may reduce notification volume in the first run after rollout because stale entries are removed. -> Mitigation: expected and desired; document in change notes.
- [Trade-off] Using per-site replacement favors correctness and simplicity over retaining historical promotion records. -> Mitigation: history remains out of scope for current cache design.
