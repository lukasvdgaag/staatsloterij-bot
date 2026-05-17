import {Cache, Config, Promotion, SiteDefinition} from "../type/types";
import {getPromotionsForSite, loadCache, saveCache} from '../util/cache';
import {sendDiscordNotification} from '../util/messenger';
import {sites} from '../sites';

const generatePromotionId = (promotion: Omit<Promotion, 'id'>): string => {
    const str = `${promotion.source}-${promotion.title}-${promotion.ctaUrl}`;
    return Buffer.from(str).toString('base64').slice(0, 32);
}

const scrapesite = async (site: SiteDefinition): Promise<Omit<Promotion, 'id'>[]> => {
    try {
        console.log(`[${site.name}] Fetching promotions from ${site.url}...`);
        const response = await fetch(site.url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const rawPromotions = site.scrape(html);

        return rawPromotions.map(p => ({
            ...p,
            source: site.id,
            scrapedAt: new Date().toISOString(),
        }));
    } catch (error) {
        console.error(`[${site.name}] Error scraping:`, error);
        return [];
    }
}

export const checkForNewPromotions = async (config: Config): Promise<void> => {
    console.log('Checking for new promotions across all sites...');

    const cache = loadCache(config);
    const allCurrentPromotions: Promotion[] = [];

    for (const site of sites) {
        const rawPromotions = await scrapesite(site);

        if (rawPromotions.length === 0) {
            console.log(`[${site.name}] No promotions found or error occurred`);
            // Keep existing cached promotions for this site
            allCurrentPromotions.push(...getPromotionsForSite(cache, site.id));
            continue;
        }

        // Tag with IDs
        const currentPromotions: Promotion[] = rawPromotions.map(p => {
            const id = generatePromotionId(p);
            return {...p, id} as Promotion;
        });

        // Find new promotions (compare only within same source)
        const cachedIds = new Set(getPromotionsForSite(cache, site.id).map(p => p.id));
        const newPromotions = currentPromotions.filter(p => !cachedIds.has(p.id));

        console.log(`[${site.name}] Found ${currentPromotions.length} promotions, ${newPromotions.length} new`);

        // Send notifications for new promotions
        for (const promotion of newPromotions) {
            await sendDiscordNotification(promotion, site, config.webhookUrl);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        allCurrentPromotions.push(...currentPromotions);

        // Delay between sites to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Update cache with all current promotions
    const updatedCache: Cache = {
        promotions: allCurrentPromotions,
        lastChecked: new Date().toISOString(),
    };

    saveCache(config, updatedCache);
}
