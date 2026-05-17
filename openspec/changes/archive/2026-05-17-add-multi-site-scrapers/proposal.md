## Why

The scraper currently only supports Staatsloterij promotions. There are multiple other Dutch media/lottery sites with similar promotion pages that we want to monitor. Adding multi-site support increases the value of the bot without duplicating infrastructure.

## What Changes

- Introduce a site registry pattern where each site defines its URL, scraping logic, display name, and brand color
- Add a `source` field (enum) to cached promotions so the single cache file can store promotions from all sites
- Make Discord embed notifications site-aware (name, color, footer)
- Add scraper implementations for Talpa Network TV, SkyRadio, Radio10, and Radio538
- Refactor the existing Staatsloterij scraper to conform to the new site interface

## Capabilities

### New Capabilities
- `multi-site-scraping`: Site registry, site interface, and individual scraper implementations for new sites
- `site-aware-notifications`: Discord embeds tailored per site (name, brand color, footer)

### Modified Capabilities
- `promotion-caching`: Add a `source` enum field to each cached promotion entry to track origin site

## Impact

- `src/type/types.ts` - New `Site` enum, updated `Promotion` and `Config` types
- `src/repository/promotions.ts` - Refactored to iterate over registered sites
- `src/util/messenger.ts` - Embed color/author/footer driven by site metadata
- `src/util/config.ts` - Multi-site configuration
- `src/util/cache.ts` - No structural changes (cache format gains `source` field on promotions)
- New files for site definitions/registry
