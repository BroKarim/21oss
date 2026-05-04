"use client";

import type { ComponentProps, ReactNode } from "react";
import { createContext, useContext } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CodeBlockContextValue = {
  code: string;
};

const CodeBlockContext = createContext<CodeBlockContextValue | null>(null);

type CodeBlockProps = {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  children?: ReactNode;
  className?: string;
};

export function CodeBlock({ code, language = "tsx", showLineNumbers = false, children, className }: CodeBlockProps) {
  const lines = code.split("\n");

  return (
    <CodeBlockContext.Provider value={{ code }}>
      <div className={cn("overflow-hidden rounded-2xl border border-border/70 bg-zinc-950 text-zinc-50", className)}>
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">{language}</span>
          <div className="flex items-center gap-2">{children}</div>
        </div>

        <div className="max-h-[60vh] overflow-auto">
          {showLineNumbers ? (
            <div className="grid min-w-full grid-cols-[auto_1fr] text-sm leading-6">
              <div className="select-none border-r border-white/10 bg-white/5 px-3 py-4 text-right text-zinc-500">
                {lines.map((_, index) => (
                  <div key={`line-number-${index + 1}`}>{index + 1}</div>
                ))}
              </div>
              <pre className="overflow-x-auto px-4 py-4">
                <code>{code}</code>
              </pre>
            </div>
          ) : (
            <pre className="overflow-x-auto px-4 py-4 text-sm leading-6">
              <code>{code}</code>
            </pre>
          )}
        </div>
      </div>
    </CodeBlockContext.Provider>
  );
}

type CodeBlockCopyButtonProps = Omit<ComponentProps<typeof Button>, "onClick" | "children"> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
};

export function CodeBlockCopyButton({ onCopy, onError, className, ...props }: CodeBlockCopyButtonProps) {
  const context = useContext(CodeBlockContext);

  async function handleCopy() {
    if (!context) return;

    try {
      await navigator.clipboard.writeText(context.code);
      onCopy?.();
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error("Failed to copy code."));
    }
  }

  return (
    <Button type="button" size="md" variant="secondary" className={cn("h-8 rounded-xl", className)} onClick={handleCopy} prefix={<Copy />} {...props}>
      Copy
    </Button>
  );
}
