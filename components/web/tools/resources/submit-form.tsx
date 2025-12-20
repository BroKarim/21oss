"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { submitTool } from "@/server/web/submissions/actions";

export function SubmitForm() {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mt-8 max-w-xl mx-auto">
      <form
        className="flex flex-col sm:flex-row items-center"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const websiteUrl = formData.get("websiteUrl") as string;
          const githubUrl = formData.get("githubUrl") as string;

          startTransition(async () => {
            try {
              await submitTool({ websiteUrl, githubUrl });
              toast.success("Submitted successfully! We’ll review it soon.", {
                description: "Thank you for helping us collect more beautiful & functional websites.",
              });
              e.currentTarget.reset();
            } catch {
              toast.error("Failed to submit. Please try again.");
            }
          });
        }}
      >
        <input name="websiteUrl" type="url" required placeholder="Website URL" className="w-full px-6 py-4 border text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition" />

        <div className="relative w-full">
          <input name="githubUrl" type="url" required placeholder="GitHub Repository URL" className="w-full px-6 py-4 pr-16 border text-white focus:outline-none focus:border-white/50 transition" />
          <button type="submit" disabled={isPending} className="absolute right-2 top-1/2 -translate-y-1/2 p-3 disabled:opacity-50 disabled:cursor-not-allowed transition">
            <ArrowRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-gray-400">*Help us collect more opensource resource. We’ll review every submission.</p>
    </div>
  );
}
