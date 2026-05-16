/**
 * Sanitize any incomplete URL and prepend the Staatsloterij website root url if not complete.
 * @param url Original url
 */
export const sanitizeUrl = (url: string): string => {
    // Trim whitespace
    url = url.trim();
    // If already absolute (http/https), return as is
    if (/^https?:\/\//i.test(url)) {
        return url;
    }
    // Remove trailing slash from host and leading slash from url to avoid double slashes
    const base = STAATSLOTERIJ_HOST.replace(/\/$/, '');
    const path = url.replace(/^\//, '');
    return `${base}/${path}`;
}

const STAATSLOTERIJ_HOST = "https://staatsloterij.nederlandseloterij.nl"