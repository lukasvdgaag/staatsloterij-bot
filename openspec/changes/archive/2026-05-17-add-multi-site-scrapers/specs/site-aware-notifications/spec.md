## ADDED Requirements

### Requirement: Site-branded Discord embeds
The system SHALL customize Discord embed notifications based on the originating site, including the site's display name as the embed author and the site's brand color as the embed color.

#### Scenario: Notification from SkyRadio
- **WHEN** a new promotion is found from SkyRadio
- **THEN** the Discord embed SHALL have color `#007CDF` and author name containing "SkyRadio"

#### Scenario: Notification from Talpa Network TV
- **WHEN** a new promotion is found from Talpa Network TV
- **THEN** the Discord embed SHALL have color `#385CF2` and author name containing "Talpa Network TV"

#### Scenario: Notification from Radio10
- **WHEN** a new promotion is found from Radio10
- **THEN** the Discord embed SHALL have color `#00D473` and author name containing "Radio10"

#### Scenario: Notification from Radio538
- **WHEN** a new promotion is found from Radio538
- **THEN** the Discord embed SHALL have color `#A400F9` and author name containing "Radio538"

#### Scenario: Notification from Staatsloterij
- **WHEN** a new promotion is found from Staatsloterij
- **THEN** the Discord embed SHALL have color `#FF6601` and author name containing "Staatsloterij"

### Requirement: Embed footer identifies source
The Discord embed footer SHALL include the site name to identify the promotion source.

#### Scenario: Footer text
- **WHEN** a Discord notification is sent for any site
- **THEN** the footer text SHALL include the site's display name
