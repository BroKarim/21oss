import { env } from "@/env";

export const siteConfig = {
  name: "21OSS",
  slug: "21oss",
  tagline: "Opensource for the sake of daily life",
  description: "open-source catalog designed to make discovering tools easier.",
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


export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};
