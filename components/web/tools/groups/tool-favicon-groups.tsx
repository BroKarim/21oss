"use client";

import { useState, useEffect } from "react";
import { ToolMany } from "@/server/web/tools/payloads";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
type ToolFaviconGroupProps = {
  id: string;
  label: string;
  description?: string;
  tools: ToolMany[];
  options: {
    showViewAll?: boolean;
    viewAllUrl?: string;
  };
};

export const ToolFaviconGroup = ({ id, label, description, tools, options }: ToolFaviconGroupProps) => {
  const { showViewAll = false, viewAllUrl } = options;
  const [copied, setCopied] = useState(false);
  const [fullLink, setFullLink] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullLink(`${window.location.origin}/home?slug=${id}`);
    }
  }, [id]);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  if (!tools.length) {
    return (
      <section className="space-y-4" id={id}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{label}</h2>
          {showViewAll && viewAllUrl && (
            <Button asChild variant="outline">
              <Link href={viewAllUrl}>View All</Link>
            </Button>
          )}
        </div>
        <div className="text-center text-muted-foreground">No tools available for this section.</div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border p-6 space-y-4" id={id}>
      <div className="flex md:items-center justify-between md:flex-row flex-col gap-2">
        <div className="flex flex-col">
          <AnimatedGradientText colorFrom="#84cc16" color="#22d3ee" className=" md:text-2xl text-lg  font-bold">
            {label}
          </AnimatedGradientText>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <LinkIcon className="h-4 w-4" />
              Share
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share this section</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <Input readOnly value={fullLink} />
              <Button variant="secondary" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
        {tools.map((tool) => (
          <Link key={tool.id} href={`/${tool.slug}`} className="flex items-center gap-3 p-2 rounded-lg transition hover:bg-accent">
            <Image src={tool.faviconUrl || "/placeholder.svg"} alt={`${tool.name} favicon`} width={48} height={48} className="rounded-sm border" />
            <div className="flex flex-col">
              <h3 className="text-sm font-medium leading-tight">{tool.name}</h3>
              {tool.platforms?.length ? <p className="text-xs text-muted-foreground">{tool.platforms.map((p) => p.name).join(", ")}</p> : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
