import * as cheerio from 'cheerio';
import {SiteDefinition, SiteId} from '../type/types';

export const staatsloterij: SiteDefinition = {
    id: SiteId.STAATSLOTERIJ,
    name: 'Staatsloterij',
    url: 'https://staatsloterij.nederlandseloterij.nl/acties',
    color: 0xFF6601,
    scrape(html: string) {
        const $ = cheerio.load(html);
        const promotions: ReturnType<SiteDefinition['scrape']> = [];

        const promotionCards = $('main section').eq(1).find('> div').children();

        promotionCards.slice(1, -1).each((_, element) => {
            const $card = $(element);

            const $title = $card.find('h3,h2');
            const title = $title.text().trim();
            const description = $title.next().text().trim();

            let imageUrl = $card.find('img').attr('src') || '';
            if (imageUrl && !imageUrl.startsWith('http')) {
                imageUrl = `https://staatsloterij.nederlandseloterij.nl${imageUrl}`;
            }

            const ctaLink = $card.find('a').last();
            const ctaText = ctaLink.text().trim();
            const ctaUrl = ctaLink.attr('href') || '';

            if (title && description && ctaUrl) {
                promotions.push({title, description, imageUrl, ctaText, ctaUrl});
            }
        });

        return promotions;
    },
};
