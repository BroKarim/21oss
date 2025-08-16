import { Dribbble, Facebook, Github, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

const data = {
  facebookLink: "https://facebook.com/mvpblocks",
  instaLink: "https://instagram.com/mvpblocks",
  twitterLink: "https://twitter.com/mvpblocks",
  githubLink: "https://github.com/mvpblocks",
  dribbbleLink: "https://dribbble.com/mvpblocks",
  programming: {
    frontend: "/categories/programming#frontend",
    backend: "/categories/programming#backend",
    components: "/categories/programming#components",
    devTools: "/categories/programming#dev-tools",
    apisIntegration: "/categories/programming#apis-and-integration",
  },
  ai: {
    llmEcosystem: "/categories/ai#llm-ecosystem",
    textSpeech: "/categories/ai#text-and-speech",
    imagesVideos: "/categories/ai#images-and-videos",
  },
  marketing: {
    seoTools: "/categories/marketing#seo-tools",
    email: "/categories/marketing#email",
    analytics: "/categories/marketing#analytics",
  },
  design: {
    colors: "/categories/design#colors",
    typography: "/categories/design#typography",
    assetGenerators: "/categories/design#asset",
    uiUx: "/categories/design#ui-ux",
    utilitySoftware: "/categories/design#utility-and-software",
    threeDMotion: "/categories/design#3d-and-motion",
  },

  company: {
    name: "OOS COLLECTOR",
    description: "Building beautiful and functional web experiences with modern technologies. We help startups and businesses create their digital presence.",
    logo: "/logo.webp",
  },
};

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: data.facebookLink },
  { icon: Instagram, label: "Instagram", href: data.instaLink },
  { icon: Twitter, label: "Twitter", href: data.twitterLink },
  { icon: Github, label: "GitHub", href: data.githubLink },
  { icon: Dribbble, label: "Dribbble", href: data.dribbbleLink },
];

const programmingLinks = [
  { text: "Frontend", href: data.programming.frontend },
  { text: "Backend", href: data.programming.backend },
  { text: "Components", href: data.programming.components },
  { text: "Dev Tools", href: data.programming.devTools },
  { text: "APIs & Integration", href: data.programming.apisIntegration },
];

const aiLinks = [
  { text: "LLM Ecosystem", href: data.ai.llmEcosystem },
  { text: "Text & Speech", href: data.ai.textSpeech },
  { text: "Images & Videos", href: data.ai.imagesVideos },
];

const marketingLinks = [
  { text: "SEO Tools", href: data.marketing.seoTools },
  { text: "Email", href: data.marketing.email },
  { text: "Analytics", href: data.marketing.analytics },
];

const designLinks = [
  { text: "Colors", href: data.design.colors },
  { text: "Typography", href: data.design.typography },
  { text: "Asset Generators", href: data.design.assetGenerators },
  { text: "UI/UX", href: data.design.uiUx },
  { text: "Utility & Software", href: data.design.utilitySoftware },
  { text: "3D & Motion", href: data.design.threeDMotion },
];

export default function Footer4Col() {
  return (
    <footer className=" w-full md:mt-4 place-self-end border">
      <div className="mx-auto max-w-screen-xl px-4 pt-8 pb-6 sm:px-6 lg:px-8 ">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="text-primary flex justify-center gap-2 sm:justify-start">
              {/* <img src={data.company.logo || "/placeholder.svg"} alt="logo" className="h-8 w-8 rounded-full" /> */}
              <span className="text-2xl font-semibold">{data.company.name}</span>
            </div>

            <p className="text-foreground/50 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">{data.company.description}</p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-primary hover:text-primary/80 transition">
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Programmimg</p>
              <ul className="mt-8 space-y-4 text-sm">
                {programmingLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a className="text-secondary-foreground/70 transition" href={href}>
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Artificial Intelegent</p>
              <ul className="mt-8 space-y-4 text-sm">
                {aiLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a className="text-secondary-foreground/70 transition" href={href}>
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Marketing</p>
              <ul className="mt-8 space-y-4 text-sm">
                {marketingLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a className="text-secondary-foreground/70 transition" href={href}>
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Design</p>
              <ul className="mt-8 space-y-4 text-sm">
                {designLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a className="text-secondary-foreground/70 transition" href={href}>
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm">
              <span className="block sm:inline">All rights reserved.</span>
            </p>

            <p className="text-secondary-foreground/70 mt-4 text-sm transition sm:order-first sm:mt-0">&copy; 2025 {data.company.name}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
