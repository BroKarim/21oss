"use client";

import { useState } from "react";
import { Share2, Twitter, Link as LinkIcon, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import type { ToolList } from "@/server/web/tools/payloads";

interface ShareButtonProps {
  tool: Pick<ToolList, "name" | "repositoryUrl" | "tagline" | "stacks" | "stars" | "forks">;
}

export function ShareButton({ tool }: ShareButtonProps) {
  const [open, setOpen] = useState(false);

  // Format stacks untuk share
  const stacksText = tool.stacks
    ?.slice(0, 3)
    .map((stack) => `#${stack.name.replace(/\s+/g, "")}`)
    .join(" ") ?? "";

  // Format tweet text
  const tweetText = `${tool.name}
${tool.tagline}
${stacksText}

⭐ Stars: ${tool.stars}
🍴 Forks: ${tool.forks}
${tool.repositoryUrl}`;

  // Link yang akan di-copy
  const shareLink = tool.repositoryUrl;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success("Link copied to clipboard!");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleCopyTweet = async () => {
    try {
      await navigator.clipboard.writeText(tweetText);
      toast.success("Tweet text copied to clipboard!");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to copy tweet");
    }
  };

  const handleTweet = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 flex-shrink-0 hover:bg-accent"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-3"
        align="end"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-2">
          <h4 className="font-medium text-sm mb-3">Share this resource</h4>
          
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={handleTweet}
          >
            <Twitter className="h-4 w-4" />
            Tweet
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={handleCopyLink}
          >
            <LinkIcon className="h-4 w-4" />
            Copy Link
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={handleCopyTweet}
          >
            <Copy className="h-4 w-4" />
            Copy Tweet
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
