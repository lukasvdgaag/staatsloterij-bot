## 1. Scrape outcome handling

- [x] 1.1 Update `src/repository/promotions.ts` scrape flow to distinguish successful scrapes from scrape failures.
- [x] 1.2 Ensure successful scrapes with zero promotions are treated as valid results rather than fallback/error cases.

## 2. Cache reconciliation and notifications

- [x] 2.1 Reconcile per-site cached promotions by replacing site entries with the latest successful scrape output so outdated promotions are removed.
- [x] 2.2 Preserve existing cached promotions for sites where scraping fails.
- [x] 2.3 Keep notification deduplication based on site-scoped cached promotion IDs and notify only newly discovered promotions.

## 3. Verification

- [x] 3.1 Validate behavior for three scenarios: successful scrape with subset, successful scrape with empty result, and scrape failure fallback.
- [x] 3.2 Run the project’s test or verification command(s) and confirm cache persistence still works after reconciliation.
