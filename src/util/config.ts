import * as path from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';
import { Config } from '../type/types';

// When running the compiled code from `dist/`, the CWD may be the project root
// but __dirname will be `dist`. Try both locations so DISCORD_WEBHOOK_URL is
// found whether running `ts-node src/index.ts` or `node dist/index.js`.
const envPaths = [path.resolve(process.cwd(), '.env'), path.resolve(__dirname, '..', '.env')];
for (const p of envPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}

export const CONFIG: Config = {
  url: 'https://staatsloterij.nederlandseloterij.nl/acties',
  webhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
  cacheFile: path.join(__dirname, 'promotions-cache.json'),
  checkInterval: 6 * 60 * 60 * 1000, // 6 hours
};