"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button-shadcn";
import { Icons } from "./icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const footerLinks = {
  pages: [
    { href: "/docs", label: "Explore" },
    { href: "/docs", label: "Awesome list" },
    { href: "/examples", label: "Blog" },
    { href: "/pricing", label: "Alternative" },
    { href: "categories/programming#apis-and-integration", label: "Categories" },
  ],
  socials: [
    { href: "https://github.com/BroKarim/open-layout", label: "Github" },
    { href: "https://www.threads.com/@brokariim", label: "Thread" },
    { href: "https://x.com/BroKariim", label: "X" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/tos", label: "Terms of Service" },
  ],
};

interface FooterLink {
  href: string;
  label: string;
}

interface FooterSectionProps {
  title: string;
  links: FooterLink[];
}

const FooterSection = ({ title, links }: FooterSectionProps) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-foreground">{title}</h3>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.label}>
          <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors duration-200">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

function Footer() {
  // const currentYear = new Date().getFullYear();
  const tweetText = encodeURIComponent("Finding the right open‑source tool is messy—#210SS makes it simple. What's one underrated tool you can't live without? @brokariim");
  const [isHovered, setIsHovered] = useState(false);
  return (
    <footer className="bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center space-x-2">
              <Icons.logo className="w-8 h-8" />
              <h2 className="text-xl font-bold text-foreground">210SS</h2>
            </Link>

            <div className="space-y-4 space-x-1">
              <div className="relative inline-block" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <p className="text-muted-foreground">
                  Build by{" "}
                  <a href="https://x.com/BroKariim" target="_blank" className="transition-colors duration-200 hover:text-foreground">
                    @Brokarim
                  </a>
                </p>

                {/* Avatar */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                  <Avatar>
                    <AvatarImage src="https://github.com/BroKarim.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <Link href={`https://x.com/compose/tweet?text=${tweetText}`}>
                <Button variant="ghost" className="border border-border hover:bg-accent transition-all duration-200">
                  Share Your Thoughts On
                  <Icons.twitter className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 lg:gap-8">
            <FooterSection title="Pages" links={footerLinks.pages} />
            <FooterSection title="Socials" links={footerLinks.socials} />
            <FooterSection title="Legal" links={footerLinks.legal} />
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center">
          <h1 className="text-center text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 select-none tracking-tight">
            21OSS.com
          </h1>
        </div>

        {/* Copyright */}
        {/* <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">© {currentYear} 210SS. All rights reserved.</p>
        </div> */}
      </div>
    </footer>
  );
}

export { Footer };
