## Context

The project is a TypeScript scraper that monitors the Staatsloterij promotions page and sends Discord webhook notifications for new promotions. It uses cheerio for HTML parsing, a JSON file cache, and a single hardcoded site configuration. We need to extend this to support 4 additional sites (Talpa Network TV, SkyRadio, Radio10, Radio538) while keeping the architecture clean and expandable.

## Goals / Non-Goals

**Goals:**
- Support multiple sites with a single bot process
- Each site defines its own scraping logic, brand metadata, and URL
- Unified cache file with source tracking per promotion
- Discord embeds customized per site (name, color)
- Easy to add new sites in the future (add one file, register it)

**Non-Goals:**
- Per-site webhook URLs (all go to same webhook for now)
- Per-site check intervals
- Web UI or dashboard
- Historical data analytics

## Decisions

### 1. Site registry pattern with a `SiteDefinition` interface

Each site is defined by an object implementing a common interface:

```typescript
interface SiteDefinition {
  id: SiteId;          // enum value
  name: string;        // Display name (e.g. "SkyRadio")
  url: string;         // URL to scrape
  color: number;       // Discord embed color as hex number
  scrape(html: string): Promotion[];  // Site-specific parsing
}
```

**Rationale**: Adding a new site means creating one file that exports a `SiteDefinition`. No changes needed to core logic. Chosen over a plugin/dynamic-loading system because the site count is small and compile-time safety is preferred.

### 2. Single cache file with `source` field on promotions

Add a `source: SiteId` field to each `Promotion`. The cache stores all promotions across sites in one array.

**Rationale**: Simpler than per-site cache files. The total promotion count across all sites is small (dozens, not thousands). The `source` field allows filtering if needed later.

### 3. Scraper loop iterates over all registered sites

The main check function iterates over all registered sites, scrapes each, and compares against cache filtered by that site's source.

**Rationale**: Sequential iteration is simpler and avoids rate-limiting issues. Each site takes only seconds to scrape.

### 4. Discord embed metadata driven by `SiteDefinition`

The messenger receives the `SiteDefinition` alongside the promotion to build the embed with the correct color, author name, and footer.

**Rationale**: Keeps all site-specific branding in one place (the site definition).

## Risks / Trade-offs

- **Different HTML structures per site** → Each site has its own `scrape()` implementation. If a site redesigns, only that scraper breaks.
- **Rate limiting across 5 sites** → Adding delays between site checks. Total cycle still well under the 6-hour interval.
- **Cache migration** → Existing cache entries lack a `source` field. Migration: treat entries without `source` as `staatsloterij`. Handle gracefully on first run.
