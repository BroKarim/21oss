"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TweetSuggestion } from "./tweet-generator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { uploadToolMedia } from "@/server/admin/tools/actions";
import { useServerAction } from "zsa-react";
import { updateTweetImage } from "@/server/admin/tweets/actions";

const FallbackImage = ({ name, stacks }: { name: string; stacks: { name: string }[] }) => (
  <div className="flex h-full w-full flex-col justify-between rounded-lg border bg-background p-4">
    <div className="space-y-3">
      <p className="text-lg font-semibold leading-snug line-clamp-2">{name}</p>
      <div className="flex flex-wrap gap-2">
        {stacks.slice(0, 3).map((stack) => (
          <Badge key={stack.name} variant="soft">
            {stack.name}
          </Badge>
        ))}
      </div>
    </div>
    <p className="text-xs text-muted-foreground">No screenshot provided</p>
  </div>
);

export function TweetSuggestionCard({ suggestion }: { suggestion: TweetSuggestion }) {
  const [copied, setCopied] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(suggestion.imageUrl ?? null);
  const [imageInput, setImageInput] = useState("");

  const updateImageAction = useServerAction(updateTweetImage, {
    onSuccess: ({ data }) => {
      setImageUrl(data.url);
      toast.success("Image saved");
    },
    onError: ({ err }) => toast.error(err.message),
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(suggestion.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const [result, error] = await uploadToolMedia({
        toolName: suggestion.name,
        file,
      });

      if (error) {
        toast.error(`Upload failed: ${error.message}`);
        return;
      }

      if (result?.url) {
        await updateImageAction.execute({ toolId: suggestion.id, imageUrl: result.url });
      }
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message}`);
    }
  };

  const handleSaveUrl = async () => {
    if (!imageInput) return;
    await updateImageAction.execute({ toolId: suggestion.id, imageUrl: imageInput });
    setImageInput("");
  };

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="aspect-[16/9] w-full overflow-hidden rounded-lg border bg-muted/40">
        {imageUrl ? (
          <img src={imageUrl} alt={`${suggestion.name} preview`} className="h-full w-full object-cover" />
        ) : (
          <FallbackImage name={suggestion.name} stacks={suggestion.stacks} />
        )}
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {suggestion.stacks.slice(0, 3).map((stack) => (
            <Badge key={stack.slug} variant="outline">
              {stack.name}
            </Badge>
          ))}
        </div>

        <p className="whitespace-pre-line text-sm text-foreground/90">{suggestion.text}</p>

        <Button type="button" size="sm" variant="secondary" onClick={handleCopy} className="gap-2">
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className={cn("h-4 w-4", copied && "text-emerald-500")} />}
          {copied ? "Copied" : "Copy Tweet"}
        </Button>

        <div className="pt-2 border-t space-y-2">
          <p className="text-xs text-muted-foreground">Upload or paste an image URL for the tweet.</p>
          <Tabs defaultValue="url">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="url">Input URL</TabsTrigger>
              <TabsTrigger value="upload">Upload File</TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <Input value={imageInput} onChange={(e) => setImageInput(e.target.value)} placeholder="https://..." />
                <Button type="button" size="sm" variant="secondary" onClick={handleSaveUrl} disabled={!imageInput || updateImageAction.isPending}>
                  Save
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="mt-2">
              <label className="flex h-28 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed bg-muted/30 text-xs text-muted-foreground hover:bg-muted/50">
                <span>Choose an image or drag & drop</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png,video/mp4"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
              </label>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
