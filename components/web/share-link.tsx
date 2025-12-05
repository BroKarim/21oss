"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";

interface ShareLinkProps {
  slug: string;
  baseUrl?: string;
}

export function ShareLink({ slug, baseUrl = "https://www.21oss.com/" }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [progress, setProgress] = useState(0);
  const duration = 4000;

  const fullUrl = `${baseUrl}/curated/${slug}`;

  useEffect(() => {
    if (copied) {
      // Delay showing confirmation to allow blur-out animation
      const showTimer = setTimeout(() => {
        setShowConfirmation(true);
      }, 400);

      setProgress(0);
      const startTime = Date.now();

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(newProgress);

        if (elapsed >= duration) {
          clearInterval(interval);
          setShowConfirmation(false);
          setTimeout(() => {
            setCopied(false);
            setProgress(0);
          }, 400);
        }
      }, 16);

      return () => {
        clearInterval(interval);
        clearTimeout(showTimer);
      };
    }
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = fullUrl;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    setCopied(true);
  };

  return (
    <div className="flex items-center gap-3 mt-10 border-t border-neutral-800 pt-6">
      <div className="relative flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 flex-1 max-w-2xl h-12">
        {/* Progress background */}
        <div
          className="absolute overflow-x-scroll max-w-xl  left-0 top-0 bottom-0 bg-neutral-800"
          style={{
            width: `${progress}%`,
            opacity: copied ? 1 : 0,
            transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* Original content - URL and copy button */}
        <div
          className="absolute inset-0 flex items-center justify-between px-4"
          style={{
            opacity: copied ? 0 : 1,
            filter: copied ? "blur(12px)" : "blur(0px)",
            transform: copied ? "scale(0.92)" : "scale(1)",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: copied ? "none" : "auto",
            zIndex: copied ? 0 : 20,
          }}
        >
          <code className="flex-1 text-sm text-neutral-300 truncate select-all pr-2">{fullUrl}</code>
          <button
            onClick={handleCopy}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-sm px-4 py-1.5 rounded-md transition-all duration-300 hover:shadow-md active:scale-95 cursor-pointer select-none flex-shrink-0"
            aria-label="Copy link"
          >
            Share
          </button>
        </div>

        {/* Confirmation content - Link Copied! */}
        <div
          className="relative flex items-center gap-3 w-full justify-center"
          style={{
            opacity: showConfirmation ? 1 : 0,
            filter: showConfirmation ? "blur(0px)" : "blur(12px)",
            transform: showConfirmation ? "scale(1)" : "scale(1.08)",
            transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <div className="w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center">
            <Check
              className="w-3.5 h-3.5 text-neutral-900"
              strokeWidth={3}
              style={{
                opacity: showConfirmation ? 1 : 0,
                transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
              }}
            />
          </div>
          <span className="text-sm font-semibold text-neutral-200">Link Copied!</span>
        </div>
      </div>
    </div>
  );
}
