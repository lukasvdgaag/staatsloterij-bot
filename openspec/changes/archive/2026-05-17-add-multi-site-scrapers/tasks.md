## 1. Types and Enums

- [x] 1.1 Add `SiteId` enum to `src/type/types.ts` with values: staatsloterij, talpa_network_tv, skyradio, radio10, radio538
- [x] 1.2 Add `source: SiteId` field to the `Promotion` interface
- [x] 1.3 Create `SiteDefinition` interface with id, name, url, color, and scrape function
- [x] 1.4 Update `Config` type to remove single-site `url` field (move to site definitions)

## 2. Site Definitions

- [x] 2.1 Create `src/sites/staatsloterij.ts` - extract existing scraping logic into a `SiteDefinition`
- [x] 2.2 Create `src/sites/talpa-network-tv.ts` with scraper for https://www.kijkers.tv/acties
- [x] 2.3 Create `src/sites/skyradio.ts` with scraper for https://www.skyradio.nl/acties
- [x] 2.4 Create `src/sites/radio10.ts` with scraper for https://www.radio10.nl/acties
- [x] 2.5 Create `src/sites/radio538.ts` with scraper for https://www.538.nl/acties
- [x] 2.6 Create `src/sites/index.ts` registry that exports all site definitions as an array

## 3. Cache Updates

- [x] 3.1 Update cache loading to default missing `source` fields to `staatsloterij`
- [x] 3.2 Update deduplication logic to compare promotions only within the same source

## 4. Core Loop Refactor

- [x] 4.1 Refactor `checkForNewPromotions` to iterate over all registered sites
- [x] 4.2 Each site: fetch HTML, call site's scrape function, tag promotions with source
- [x] 4.3 Add delay between site checks to avoid rate limiting

## 5. Discord Notifications

- [x] 5.1 Update `sendDiscordNotification` to accept a `SiteDefinition` parameter
- [x] 5.2 Set embed color from site definition
- [x] 5.3 Set embed author name to site-specific text (e.g. "Nieuwe SkyRadio promotie!")
- [x] 5.4 Set embed footer to include the site's display name

## 6. Config and Entrypoint

- [x] 6.1 Update `config.ts` to remove hardcoded URL (sites own their URLs)
- [x] 6.2 Update `index.ts` to log multi-site startup info
