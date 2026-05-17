## ADDED Requirements

### Requirement: Source field on cached promotions
Each promotion entry in the cache SHALL include a `source` field containing the `SiteId` enum value of the site it was scraped from.

#### Scenario: New promotion cached
- **WHEN** a promotion is scraped from any site
- **THEN** the cached entry SHALL include the `source` field set to that site's `SiteId`

### Requirement: Backward-compatible cache migration
The system SHALL treat existing cache entries that lack a `source` field as originating from `staatsloterij`.

#### Scenario: First run after upgrade
- **WHEN** the bot loads a cache file with entries missing the `source` field
- **THEN** those entries SHALL be treated as `source: "staatsloterij"`

### Requirement: Per-site deduplication
The system SHALL deduplicate promotions per site when checking for new entries, comparing only against cached promotions from the same source.

#### Scenario: Same title on different sites
- **WHEN** two different sites have promotions with identical titles
- **THEN** both SHALL be treated as distinct promotions and both trigger notifications
