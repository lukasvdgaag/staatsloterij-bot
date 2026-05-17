import * as fs from 'fs';
import {Cache, Config, Promotion, SiteId} from "../type/types";

export const loadCache = (config: Config): Cache => {
    try {
        if (fs.existsSync(config.cacheFile)) {
            const data = fs.readFileSync(config.cacheFile, 'utf-8');
            const cache: Cache = JSON.parse(data);
            // Backward compatibility
            cache.promotions = cache.promotions.map(p => ({
                ...p,
                source: p.source || SiteId.STAATSLOTERIJ,
            }));
            return cache;
        }
    } catch (error) {
        console.error('Error loading cache:', error);
    }
    return {promotions: [], lastChecked: ''};
}

export const saveCache = (config: Config, cache: Cache): void => {
    try {
        fs.writeFileSync(config.cacheFile, JSON.stringify(cache, null, 2));
        console.log('Cache saved successfully');
    } catch (error) {
        console.error('Error saving cache:', error);
    }
}

export const getPromotionsForSite = (cache: Cache, siteId: SiteId): Promotion[] => {
    return cache.promotions.filter(p => p.source === siteId);
}
