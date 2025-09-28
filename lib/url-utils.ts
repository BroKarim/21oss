import { isValidUrl } from "@primoui/utils";

/**
 * Extracts domain from a URL string
 * @param url - The URL to extract domain from
 * @returns The domain or empty string if invalid
 */
const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return "";
  }
};

/**
 * Generates Google favicon URL for a given website URL
 * @param websiteUrl - The website URL to get favicon for
 * @returns Google favicon URL or empty string if invalid
 */
export const generateFaviconUrl = (websiteUrl: string): string => {
  if (!isValidUrl(websiteUrl)) return "";
  const domain = extractDomain(websiteUrl);
  if (!domain) return "";
  return `https://www.google.com/s2/favicons?sz=96&domain_url=${domain}`;
};
