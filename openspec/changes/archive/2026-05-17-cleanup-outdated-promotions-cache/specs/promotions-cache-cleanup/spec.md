## ADDED Requirements

### Requirement: Cache reflects successful scrape results per site
The system MUST reconcile cached promotions for each site with the latest successful scrape result for that site. After reconciliation, cached promotions for a site SHALL exactly match the promotions returned by the successful scrape, including when that result is empty.

#### Scenario: Remove outdated promotions after successful scrape
- **WHEN** cached promotions exist for a site and a new scrape for that same site succeeds with a subset of those promotions
- **THEN** promotions absent from the new scrape result are removed from cache
- **THEN** promotions present in the new scrape result remain in cache

#### Scenario: Clear site cache when successful scrape returns no promotions
- **WHEN** cached promotions exist for a site and a new scrape for that same site succeeds with zero promotions
- **THEN** all cached promotions for that site are removed

### Requirement: Cache is preserved on scrape failure
The system MUST preserve existing cached promotions for a site when scraping that site fails due to fetch, parsing, or processing errors.

#### Scenario: Keep cached promotions during temporary scrape failure
- **WHEN** cached promotions exist for a site and the site scrape fails
- **THEN** cached promotions for that site remain unchanged in the persisted cache

### Requirement: Notifications are sent only for newly discovered promotions
The system MUST continue deduplicating notifications by promotion identity within each site, sending notifications only for promotions that are present in the latest successful scrape but absent from that site's prior cache.

#### Scenario: Notify only newly discovered promotions
- **WHEN** a successful scrape returns promotions for a site and some promotion IDs already exist in that site's cached promotions
- **THEN** notifications are sent only for promotions whose IDs are not in that site's cached promotions
- **THEN** no notification is sent for promotions already present in cache
