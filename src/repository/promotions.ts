import * as cheerio from 'cheerio';
import { Cache, Config, Promotion } from "../type/types";
import { loadCache, saveCache} from '../util/cache';
import { sendDiscordNotification } from '../util/messenger';

// Scraping function
const scrapePromotions = async (config: Config): Promise<Promotion[]> => {
  try {
    console.log('Fetching promotions page...');
    const response = await fetch(config.url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const promotions: Promotion[] = [];
    
    // Find the main element, then the first section > div div
    const promotionCards = $('main section').eq(1).find('> div').children();
    
    // Skip the first and last cards
    promotionCards.slice(1, -1).each((_, element) => {
      const $card = $(element);
      
      // Extract title
      const $title = $card.find('h3');
      const title = $title.text().trim();
      
      // Extract description (from markdown)
      const description = $title.next().text().trim();
      
      // Extract image URL
      let imageUrl = $card.find('img').attr('src') || '';
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `https://staatsloterij.nederlandseloterij.nl${imageUrl}`;
      }
      
      // Extract CTA button
      const ctaLink = $card.find('a').last();
      const ctaText = ctaLink.text().trim();
      const ctaUrl = ctaLink.attr('href') || '';
      
      // Only add if we have the essential data
      if (title && description && ctaUrl) {
        const promotion: Promotion = {
          id: '', // Will be set after
          title,
          description,
          imageUrl,
          ctaText,
          ctaUrl,
          scrapedAt: new Date().toISOString(),
        };
        
        promotion.id = generatePromotionId(promotion);
        promotions.push(promotion);
      }
    });
    
    console.log(`Found ${promotions.length} promotions`);
    return promotions;
  } catch (error) {
    console.error('Error scraping promotions:', error);
    return [];
  }
}

export const checkForNewPromotions = async (config: Config): Promise<void> => {
  console.log('Checking for new promotions...');
  
  const cache = loadCache(config);
  const currentPromotions = await scrapePromotions(config);
  
  if (currentPromotions.length === 0) {
    console.log('No promotions found or error occurred');
    return;
  }
  
  // Find new promotions
  const cachedIds = new Set(cache.promotions.map(p => p.id));
  const newPromotions = currentPromotions.filter(p => !cachedIds.has(p.id));
  
  console.log(`Found ${newPromotions.length} new promotions`);
  
  // Send notifications for new promotions
  for (const promotion of newPromotions) {
    await sendDiscordNotification(promotion, config.webhookUrl);
    // Add a small delay between notifications to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Update cache
  const updatedCache: Cache = {
    promotions: currentPromotions,
    lastChecked: new Date().toISOString(),
  };
  
  saveCache(config, updatedCache);
}

const generatePromotionId = (promotion: Promotion): string => {
  // Create a unique ID based on title and CTA URL
  const str = `${promotion.title}-${promotion.ctaUrl}`;
  return Buffer.from(str).toString('base64').slice(0, 32);
}