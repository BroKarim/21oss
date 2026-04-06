import { slugify } from "@primoui/utils";

type StackCanonical = { name: string; slug: string };

const STACK_ALIASES: Record<string, StackCanonical> = {
  // Tailwind
  "tailwind": { name: "Tailwind CSS", slug: "tailwindcss" },
  "tailwind css": { name: "Tailwind CSS", slug: "tailwindcss" },
  "tailwindcss": { name: "Tailwind CSS", slug: "tailwindcss" },

  // Next.js
  "nextjs": { name: "Next.js", slug: "nextjs" },
  "next js": { name: "Next.js", slug: "nextjs" },
  "next.js": { name: "Next.js", slug: "nextjs" },
};

const normalizeKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export const normalizeStackInput = (rawName: string): StackCanonical => {
  const name = rawName.trim();
  const key = normalizeKey(name);
  const alias = STACK_ALIASES[key];
  if (alias) return alias;

  return { name, slug: slugify(name) };
};
