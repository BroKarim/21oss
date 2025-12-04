"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface ShareLinkProps {
  slug: string;
  baseUrl?: string;
}

export function ShareLink({ slug, baseUrl = "" }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = `${baseUrl}/curated/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex max-w-xl items-center gap-3 border-neutral-800 pt-6">
      <span className="text-sm text-neutral-400 font-medium">Share:</span>

      <div className="flex-1 flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2">
        <code className="flex-1 text-sm text-neutral-300 truncate">{fullUrl}</code>

        <button onClick={handleCopy} className="text-neutral-400 hover:text-neutral-200 transition-colors p-1 flex-shrink-0" aria-label="Copy link">
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
