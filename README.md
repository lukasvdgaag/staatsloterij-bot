# StaatsLoterij Discord Bot

A TypeScript bot that scrapes the StaatsLoterij promotions page daily and sends Discord notifications when new promotions are added.

## Features

- 🔍 Scrapes promotions from the official StaatsLoterij website
- 📅 Checks for new promotions every 24 hours
- 💾 Caches promotions locally to detect new ones
- 🔔 Sends Discord notifications with rich embeds
- 🖼️ Includes promotion images and CTA buttons
- 🚀 Written in TypeScript with type safety

## Setup

### 1. Install Dependencies

```bash
yarn install
```

### 2. Configure Discord Webhook

1. Go to your Discord server
2. Navigate to **Server Settings** → **Integrations** → **Webhooks**
3. Click **New Webhook** or select an existing one
4. Copy the Webhook URL
5. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

6. Add your webhook URL to the `.env` file:

```
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
```

### 3. Build the Project

```bash
yarn build
```

### 4. Run the Bot

#### Development Mode (with auto-restart)
```bash
yarn dev
```

#### Production Mode
```bash
yarn start
```

## How It Works

1. **Scraping**: The bot fetches the promotions page and parses HTML using Cheerio
2. **Caching**: Promotions are stored in `promotions-cache.json` with unique IDs
3. **Detection**: New promotions are identified by comparing with cached IDs
4. **Notification**: Discord webhook sends rich embeds with:
   - Promotion title
   - Description
   - Banner image
   - CTA button linking to the promotion

## Project Structure

```
├── src/
│   └── index.ts          # Main bot code
├── dist/                 # Compiled JavaScript (generated)
├── promotions-cache.json # Local cache (auto-generated)
├── package.json
├── tsconfig.json
├── .env                  # Your configuration (not in git)
└── .env.example          # Example configuration
```

## Cache File

The bot creates a `promotions-cache.json` file that stores:
- All current promotions with their IDs
- Last check timestamp
- Full promotion details

**Note**: Do not delete this file while the bot is running, as it will resend all promotions as "new".

## Running as a Service

### Using PM2 (Recommended)

```bash
# Install PM2 globally
yarn install -g pm2

# Start the bot
pm2 start dist/index.js --name staatsloterij-bot

# Auto-start on system reboot
pm2 startup
pm2 save
```

### Using systemd (Linux)

Create `/etc/systemd/system/staatsloterij-bot.service`:

```ini
[Unit]
Description=StaatsLoterij Discord Bot
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/bot
ExecStart=/usr/bin/node /path/to/bot/dist/index.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable staatsloterij-bot
sudo systemctl start staatsloterij-bot
```

## Customization

### Change Check Interval

Edit the `checkInterval` in `src/index.ts`:

```typescript
const CONFIG = {
  // ...
  checkInterval: 24 * 60 * 60 * 1000, // 24 hours (in milliseconds)
};
```

### Customize Discord Embed

Modify the embed in the `sendDiscordNotification` function:

```typescript
const embed = {
  title: promotion.title,
  description: promotion.description,
  color: 0x0066CC, // Change color here (hex without #)
  // ... other properties
};
```

## Other Notes

### Club Polls

Staatsloterij has a monthly opinion panel (poll), where you can submit your answer to a selection of four options to a statement. You will get +5 club points for a submitted answer.  

They call `https://club-staatsloterij.nederlandseloterij.nl/poll/post` to submit your answer. Though, when you catch the sent out request, and send it again, you will get +5 points again. You can do this a couple times before the request expires! 🤑

## Troubleshooting

### Bot doesn't send notifications

1. Verify your webhook URL is correct
2. Check the console for error messages
3. Ensure the bot has successfully scraped promotions (check logs)

### Cache file issues

If the bot keeps resending old promotions:
1. Stop the bot
2. Delete `promotions-cache.json`
3. Restart the bot (it will rebuild the cache)

### Scraping fails

The StaatsLoterij website structure might have changed. Check:
1. The URL is still accessible
2. The HTML structure matches the selectors in the code
3. Console logs for specific error messages

## License

MIT