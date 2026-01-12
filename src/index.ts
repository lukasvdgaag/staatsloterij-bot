import { checkForNewPromotions } from './repository/promotions';
import { CONFIG } from './util/config';

// Run the bot
async function runBot(): Promise<void> {
  console.log('StaatsLoterij Discord Bot started');
  console.log(`Webhook configured: ${!!CONFIG.webhookUrl}`);
  
  // Initial check
  await checkForNewPromotions(CONFIG);
  
  // Schedule daily checks
  setInterval(async () => {
    await checkForNewPromotions(CONFIG);
  }, CONFIG.checkInterval);
  
  console.log(`Bot will check for new promotions every ${CONFIG.checkInterval / (1000 * 60 * 60)} hours`);
}

// Start the bot
runBot().catch(console.error);