// Types

export enum SiteId {
    STAATSLOTERIJ = 'staatsloterij',
    TALPA_NETWORK_TV = 'talpa_network_tv',
    SKYRADIO = 'skyradio',
    RADIO10 = 'radio10',
    RADIO538 = 'radio538',
}

export interface Promotion {
    id: string;
    source: SiteId;
    title: string;
    description?: string;
    imageUrl: string;
    ctaText: string;
    ctaUrl: string;
    scrapedAt: string;
}

export interface SiteDefinition {
    id: SiteId;
    name: string;
    baseUrl: string;
    promotionsPath: string;
    color: number;

    scrape(html: string): Omit<Promotion, 'id' | 'source' | 'scrapedAt'>[];
}

export interface Cache {
    promotions: Promotion[];
    lastChecked: string;
}

export interface Config {
    webhookUrl: string;
    cacheFile: string;
    checkInterval: number;
}
