import { db } from "@/services/db";

async function main() {
  const content = await db.tool.upsert({
    where: { slug: "shadcn-ui" },
    update: {},
    create: {
      name: "shadcn/ui",
      slug: "shadcn-ui",
      websiteUrl: "https://ui.shadcn.com",
      repositoryUrl: "https://github.com/shadcn-ui/ui",
      demoUrl: "https://ui.shadcn.com",
      tagline: "Beautifully designed components built with Radix UI and Tailwind CSS.",
      description: "shadcn/ui is a collection of UI components built with accessibility and customization in mind. Designed for Next.js apps.",
      stars: 25000,
      forks: 2000,
      faviconUrl: "https://ui.shadcn.com/favicon.ico",
      screenshotUrl: "https://ui.shadcn.com/og.jpg",
      publishedAt: new Date("2023-02-01"),
      license: {
        connect: { slug: "mit" },
      },
      platforms: {
        connect: [{ slug: "web" }],
      },
      stacks: {
        connect: [{ slug: "react" }, { slug: "next-js" }, { slug: "tailwind" }, { slug: "radix-ui" }],
      },
    },
  });

  console.log("Seeded:", content.name);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
