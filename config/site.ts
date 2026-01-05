import { env } from "@/env";

export const siteConfig = {
  name: "21OSS",
  slug: "21oss",
  tagline: "Open-source resources to ship projects faster",
  description: "A curated open-source library of templates, icons, and UI components to help developers ship projects faster.",
  alphabet: "abcdefghijklmnopqrstuvwxyz",
  url: env.NEXT_PUBLIC_SITE_URL,
  email: env.NEXT_PUBLIC_SITE_EMAIL,
  ogImage: "https://21oss.com/og.png",
  author: "BroKarim",
  links: {
    thread: "https://www.threads.net/@brokariim",
    github: "https://github.com/BroKarim",
  },
};

export const submitUrl = "https://forms.gle/vXwhH5psEkZYMqsu9";

export const META_THEME_COLORS = {
  light: "#ffffff",

  dark: "#09090b",
};
