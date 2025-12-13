import { isValidUrl } from "@primoui/utils";
import { ToolType } from "@prisma/client";
import { useEffect } from "react";

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

const extractGithubOwner = (repoUrl: string): string | null => {
  try {
    const url = new URL(repoUrl);
    if (url.hostname !== "github.com") return null;

    const [owner] = url.pathname.split("/").filter(Boolean);
    return owner ?? null;
  } catch {
    return null;
  }
};

// Di utils atau hooks file
export const computeFaviconUrl = ({ form, sourceFields, computedField, callback, enabled = true }: { form: any; sourceFields: string[]; computedField: string; callback: (values: any) => string; enabled?: boolean }) => {
  useEffect(() => {
    if (!enabled) return;

    const subscription = form.watch((value: any, { name }: any) => {
      if (sourceFields.includes(name)) {
        const computedValue = callback(value);

        if (computedValue !== form.getValues(computedField)) {
          form.setValue(computedField, computedValue, {
            shouldValidate: false,
            shouldDirty: true,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, sourceFields, computedField, callback, enabled]);
};

/**
 * Generates Google favicon URL for a given website URL
 * @param websiteUrl - The website URL to get favicon for
 * @returns Google favicon URL or empty string if invalid
 */
export const generateFaviconUrl = ({ websiteUrl, repoUrl, type }: { websiteUrl?: string | null; repoUrl?: string | null; type: ToolType }): string => {
  if (type !== ToolType.Tool && repoUrl) {
    const owner = extractGithubOwner(repoUrl);
    if (owner) {
      return `https://github.com/${owner}.png`;
    }
  }

  if (!websiteUrl || !isValidUrl(websiteUrl)) return "";
  const domain = extractDomain(websiteUrl);
  if (!domain) return "";

  return `https://www.google.com/s2/favicons?sz=96&domain_url=${domain}`;
};
