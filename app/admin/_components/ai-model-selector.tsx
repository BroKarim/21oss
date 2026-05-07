"use client";

import * as React from "react";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";
import { ChevronDown, Brain, Zap, Sparkles } from "lucide-react";
import { useClickAway } from "@/hooks/use-click-away";

interface AIModel {
  value: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

interface AIModelSelectorProps {
  models: AIModel[];
  selectedModel: string;
  onModelChange: (value: string) => void;
  onAutoFill: () => void;
  isLoading?: boolean;
}

const IconWrapper = ({ icon: Icon, isHovered, color }: { icon: React.ElementType; isHovered: boolean; color: string }) => (
  <m.div className="w-4 h-4 mr-2 relative" initial={false} animate={isHovered ? { scale: 1.2 } : { scale: 1 }}>
    <Icon className="w-4 h-4" />
    {isHovered && (
      <m.div className="absolute inset-0" style={{ color }} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
        <Icon className="w-4 h-4" strokeWidth={2} />
      </m.div>
    )}
  </m.div>
);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export function AIModelSelector({ models, selectedModel, onModelChange, onAutoFill, isLoading = false }: AIModelSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hoveredModel, setHoveredModel] = React.useState<string | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useClickAway(dropdownRef as React.RefObject<HTMLElement>, () => setIsOpen(false));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <div className="inline-flex -space-x-px divide-x divide-primary-foreground/30 rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse">
          <Button type="button" variant="secondary" size="sm" disabled={isLoading} onClick={onAutoFill} className="rounded-r-none border-r-0 focus:z-10">
            {isLoading ? "Filling..." : "Auto Fill"}{" "}
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "16px",
                  height: "16px",
                }}
              >
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </m.div>
            </Button>

            <AnimatePresence>
              {isOpen && (
                <m.div
                  initial={{ opacity: 1, y: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    height: "auto",
                    transition: {
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      mass: 1,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: 0,
                    height: 0,
                    transition: {
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      mass: 1,
                    },
                  }}
                  className="absolute right-0 top-full mt-2 z-50"
                  onKeyDown={handleKeyDown}
                  style={{ minWidth: "220px" }}
                >
                  <m.div
                    className={cn("rounded-lg border border-border bg-popover p-1 shadow-lg")}
                    initial={{ borderRadius: 8 }}
                    animate={{
                      borderRadius: 12,
                      transition: { duration: 0.2 },
                    }}
                    style={{ transformOrigin: "top" }}
                  >
                    <m.div className="py-2 relative" variants={containerVariants} initial="hidden" animate="visible">
                      <m.div
                        layoutId="hover-highlight"
                        className="absolute inset-x-1 bg-accent rounded-md"
                        animate={{
                          y: models.findIndex((model) => (hoveredModel || selectedModel) === model.value) * 40,
                          height: 40,
                        }}
                        transition={{
                          type: "spring",
                          bounce: 0.15,
                          duration: 0.5,
                        }}
                      />
                      {models.map((model) => (
                        <m.button
                          key={model.value}
                          onClick={() => {
                            onModelChange(model.value);
                            setIsOpen(false);
                          }}
                          onHoverStart={() => setHoveredModel(model.value)}
                          onHoverEnd={() => setHoveredModel(null)}
                          className={cn(
                            "relative flex w-full items-center px-4 py-2.5 text-sm rounded-md",
                            "transition-colors duration-150",
                            "focus:outline-none",
                            selectedModel === model.value || hoveredModel === model.value ? "text-foreground" : "text-muted-foreground"
                          )}
                          whileTap={{ scale: 0.98 }}
                          variants={itemVariants}
                        >
                          <IconWrapper icon={model.icon} isHovered={hoveredModel === model.value} color={model.color} />
                          {model.label}
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

// Export default models untuk kemudahan penggunaan
export const DEFAULT_AI_MODELS: AIModel[] = [
  { value: "deepseek/deepseek-chat-v3.1:free", label: "DeepSeek Chat", icon: Brain, color: "#A06CD5" },
  { value: "meta-llama/llama-3.3-8b-instruct:free", label: "LLaMA 3.3 8B", icon: Zap, color: "#FF6B6B" },
  { value: "anthropic/claude-sonnet-4.5", label: "Claude Sonnet 4.5", icon: Sparkles, color: "#45B7D1" },
  { value: "openai/gpt-4o-mini", label: "GPT-4o Mini", icon: Zap, color: "#F9C74F" },
];
