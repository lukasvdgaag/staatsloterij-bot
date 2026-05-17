import {SiteDefinition} from "../type/types";

/**
 * Sanitize any incomplete URL and prepend the Staatsloterij website root url if not complete.
 * @param site Definition of the site to sanitize url of
 * @param url Original url
 */
export const sanitizeUrl = (
    site: SiteDefinition,
    url: string,
): string => {
    // Trim whitespace
    url = url.trim();
    // If already absolute (http/https), return as is
    if (/^https?:\/\//i.test(url)) {
        return url;
    }
    // Remove trailing slash from host and leading slash from url to avoid double slashes
    const base = site.baseUrl.replace(/\/$/, '');
    const path = url.replace(/^\//, '');
    return `${base}/${path}`;
}