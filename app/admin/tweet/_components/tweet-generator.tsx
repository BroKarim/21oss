"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { Button } from "@/components/ui/button";
import { generateTweetSuggestions } from "@/server/admin/tweets/actions";
import { TweetSuggestionCard } from "./tweet-suggestion-card";
import { DEFAULT_AI_MODELS } from "@/app/admin/_components/ai-model-selector";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type TweetSuggestion = {
  id: string;
  slug: string;
  name: string;
  stars: number;
  forks?: number;
  stacks: { name: string; slug: string }[];
  imageUrl: string | null;
  text: string;
};

export function TweetGenerator() {
  const { refresh } = useRouter();
  const [suggestions, setSuggestions] = useState<TweetSuggestion[]>([]);
  const [model, setModel] = useState("anthropic/claude-sonnet-4.5");
  const [isModelOpen, setIsModelOpen] = useState(false);

  const { execute, isPending } = useServerAction(generateTweetSuggestions, {
    onSuccess: ({ data }) => {
      setSuggestions(data.suggestions ?? []);
      refresh();
    },
    onError: ({ err }) => toast.error(`Failed to generate tweets: ${err.message}`),
  });

  const canRenderSuggestions = useMemo(() => suggestions.length > 0, [suggestions.length]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex -space-x-px divide-x divide-border rounded-lg shadow-sm">
          <Button type="button" variant="primary" disabled={isPending} className="rounded-r-none" onClick={() => execute({ count: 3, model })}>
            {isPending ? "Generating..." : "Generate 3 Tweets"}
          </Button>
          <div className="relative">
            <Button type="button" variant="primary" className="rounded-l-none px-2" onClick={() => setIsModelOpen((v) => !v)}>
              <ChevronDown className={cn("h-4 w-4 transition-transform", isModelOpen && "rotate-180")} />
            </Button>
            {isModelOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 min-w-[200px] rounded-lg border border-border bg-popover p-1 shadow-lg">
                {DEFAULT_AI_MODELS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => {
                      setModel(m.value);
                      setIsModelOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                      model === m.value ? "text-foreground font-medium" : "text-muted-foreground",
                    )}
                  >
                    <m.icon className="h-3.5 w-3.5 shrink-0" />
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {canRenderSuggestions && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold">New Tweets</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {suggestions.map((suggestion) => (
              <TweetSuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
