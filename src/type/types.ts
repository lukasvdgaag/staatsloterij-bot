// Types
export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  scrapedAt: string;
}

export interface Cache {
  promotions: Promotion[];
  lastChecked: string;
}

export interface Config {
    url: string;
    webhookUrl: string;
    cacheFile: string;
    checkInterval: number;
}