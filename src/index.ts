import {checkForNewPromotions} from './repository/promotions';
import {CONFIG} from './util/config';
import {sites} from './sites';

// Run the bot
async function runBot(): Promise<void> {
    console.log('Promotions Discord Bot started');
    console.log(`Webhook configured: ${!!CONFIG.webhookUrl}`);
    console.log(`Monitoring ${sites.length} sites: ${sites.map(s => s.name).join(', ')}`);

    // Initial check
    await checkForNewPromotions(CONFIG);

    // Schedule periodic checks
    setInterval(async () => {
        await checkForNewPromotions(CONFIG);
    }, CONFIG.checkInterval);

    console.log(`Bot will check for new promotions every ${CONFIG.checkInterval / (1000 * 60 * 60)} hours`);
}

// Start the bot
runBot().catch(console.error);
