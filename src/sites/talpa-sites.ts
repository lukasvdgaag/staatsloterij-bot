import * as cheerio from 'cheerio';
import {SiteDefinition, SiteId} from '../type/types';

/**
 * Shared scraper for Talpa Network WebX sites.
 * All these sites use the same component structure.
 */
function scrapeTalpaSite(html: string): ReturnType<SiteDefinition['scrape']> {
    const $ = cheerio.load(html);
    const promotions: ReturnType<SiteDefinition['scrape']> = [];

    // Cards in the promotions grid each contain an h6 title and an img.
    // A [data-label] element inside the card carries the status text.
    $('#page-container a').has('h6').each((_, element) => {
        const $card = $(element);

        const title = $card.find('h6').text().trim();
        const imageUrl = $card.find('img').attr('src') || '';
        const ctaUrl = $card.attr('href') || '';
        const statusLabel = $card.find('[data-label]').attr('data-label');

        // Only include cards that have a status label AND are not expired.
        const hasValidStatusLabel = statusLabel && statusLabel.includes("Doe mee");

        if (title && ctaUrl && hasValidStatusLabel) {
            promotions.push({
                title,
                imageUrl,
                ctaText: 'Bekijk actie',
                ctaUrl,
            });
        }
    });

    return promotions;
}

export const talpaNetworkTv: SiteDefinition = {
    id: SiteId.TALPA_NETWORK_TV,
    name: 'Talpa Network TV',
    baseUrl: 'https://www.kijkers.tv',
    promotionsPath: 'acties',
    color: 0x385CF2,
    scrape(html: string) {
        return scrapeTalpaSite(html);
    },
};

export const skyradio: SiteDefinition = {
    id: SiteId.SKYRADIO,
    name: 'Sky Radio',
    baseUrl: 'https://www.skyradio.nl',
    promotionsPath: 'acties',
    color: 0x007CDF,
    scrape(html: string) {
        return scrapeTalpaSite(html);
    },
};

export const radio10: SiteDefinition = {
    id: SiteId.RADIO10,
    name: 'Radio 10',
    baseUrl: 'https://www.radio10.nl',
    promotionsPath: 'acties',
    color: 0x00D473,
    scrape(html: string) {
        return scrapeTalpaSite(html);
    },
};

export const radio538: SiteDefinition = {
    id: SiteId.RADIO538,
    name: 'Radio 538',
    baseUrl: 'https://www.538.nl',
    promotionsPath: 'acties',
    color: 0xA400F9,
    scrape(html: string) {
        return scrapeTalpaSite(html);
    },
};

