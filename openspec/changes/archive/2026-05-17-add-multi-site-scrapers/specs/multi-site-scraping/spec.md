## ADDED Requirements

### Requirement: Site definition interface
The system SHALL define a `SiteDefinition` interface that each site implements, containing: id (enum), name (string), url (string), color (hex number), and a scrape function that accepts HTML and returns promotions.

#### Scenario: Adding a new site
- **WHEN** a developer creates a new file implementing `SiteDefinition`
- **THEN** they can register it in the site registry and the bot will scrape it on the next cycle

### Requirement: Site registry
The system SHALL maintain a registry of all active site definitions that the main loop iterates over.

#### Scenario: Bot startup with multiple sites
- **WHEN** the bot starts
- **THEN** it SHALL scrape all registered sites in sequence

### Requirement: Per-site scraping logic
Each site definition SHALL implement its own `scrape()` function that parses that site's specific HTML structure and returns an array of `Promotion` objects.

#### Scenario: Scraping Talpa Network TV
- **WHEN** the bot fetches HTML from https://www.kijkers.tv/acties
- **THEN** it SHALL parse promotions using the Talpa-specific scraper

#### Scenario: Scraping SkyRadio
- **WHEN** the bot fetches HTML from https://www.skyradio.nl/acties
- **THEN** it SHALL parse promotions using the SkyRadio-specific scraper

#### Scenario: Scraping Radio10
- **WHEN** the bot fetches HTML from https://www.radio10.nl/acties
- **THEN** it SHALL parse promotions using the Radio10-specific scraper

#### Scenario: Scraping Radio538
- **WHEN** the bot fetches HTML from https://www.538.nl/acties
- **THEN** it SHALL parse promotions using the Radio538-specific scraper

### Requirement: Site enum
The system SHALL define a `SiteId` enum with values: `staatsloterij`, `talpa_network_tv`, `skyradio`, `radio10`, `radio538`.

#### Scenario: Enum usage
- **WHEN** a promotion is created by a scraper
- **THEN** it SHALL be tagged with the corresponding `SiteId` enum value
