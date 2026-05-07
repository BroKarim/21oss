"use client";

import * as React from "react";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "framer-motion";
import { Button } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useClickAway } from "@/hooks/use-click-away";
import { DEFAULT_AI_MODELS } from "@/app/admin/_components/ai-model-selector";
import { batchAutoFillDraftTools } from "@/server/admin/tools/actions";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";

export function AIDraftFillButton({ draftCount }: { draftCount: number }) {
  const [model, setModel] = React.useState("anthropic/claude-sonnet-4.5");
  const [isOpen, setIsOpen] = React.useState(false);
  const [hoveredModel, setHoveredModel] = React.useState<string | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useClickAway(dropdownRef as React.RefObject<HTMLElement>, () => setIsOpen(false));

  const { execute, isPending } = useServerAction(batchAutoFillDraftTools, {
    onSuccess: ({ data }) => {
      toast.success(`✅ AI fill done — ${data.success} success${data.errors > 0 ? `, ${data.errors} failed` : ""}`);
    },
    onError: ({ err }) => toast.error(`❌ ${err.message}`),
  });

  if (draftCount === 0) return null;

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <div className="inline-flex -space-x-px divide-x divide-primary-foreground/30 rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse">
          <Button type="button" variant="secondary" size="sm" disabled={isPending} onClick={() => execute({ model })} className="rounded-r-none border-r-0 focus:z-10">
            {isPending ? "Filling..." : `AI Fill ${draftCount} Drafts`}
          </Button>

          <div className="relative" ref={dropdownRef}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className={cn("rounded-l-none px-2 focus:z-10 transition-all duration-200", isOpen && "bg-secondary/80")}
              aria-expanded={isOpen}
              aria-haspopup="true"
            >
              <m.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px" }}
              >
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </m.div>
            </Button>

            <AnimatePresence>
              {isOpen && (
                <m.div
                  initial={{ opacity: 1, y: 0, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto", transition: { type: "spring", stiffness: 500, damping: 30, mass: 1 } }}
                  exit={{ opacity: 0, y: 0, height: 0, transition: { type: "spring", stiffness: 500, damping: 30, mass: 1 } }}
                  className="absolute right-0 top-full mt-2 z-50"
                  style={{ minWidth: "220px" }}
                >
                  <m.div className={cn("rounded-lg border border-border bg-popover p-1 shadow-lg")}>
                    <m.div className="py-2 relative">
                      <m.div
                        className="absolute inset-x-1 bg-accent rounded-md"
                        animate={{ y: DEFAULT_AI_MODELS.findIndex((aiModel) => (hoveredModel || model) === aiModel.value) * 40, height: 40 }}
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                      {DEFAULT_AI_MODELS.map((aiModel) => (
                        <m.button
                          key={aiModel.value}
                          onClick={() => {
                            setModel(aiModel.value);
                            setIsOpen(false);
                          }}
                          onHoverStart={() => setHoveredModel(aiModel.value)}
                          onHoverEnd={() => setHoveredModel(null)}
                          className={cn(
                            "relative flex w-full items-center px-4 py-2.5 text-sm rounded-md",
                            "transition-colors duration-150",
                            "focus:outline-none",
                            model === aiModel.value || hoveredModel === aiModel.value ? "text-foreground" : "text-muted-foreground",
                          )}
                          whileTap={{ scale: 0.98 }}
                        >
                          <aiModel.icon className="w-4 h-4 mr-2" />
                          {aiModel.label}
                        </m.button>
                      ))}
                    </m.div>
                  </m.div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
