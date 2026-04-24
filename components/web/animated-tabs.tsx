"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";

export interface AnimatedTabsProps {
  tabs: { label: string; value: string }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function AnimatedTabs({ tabs, value, defaultValue, onValueChange, disabled = false, className }: AnimatedTabsProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? tabs[0]?.value ?? "");
  const activeValue = isControlled ? value : internalValue;

  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container && activeValue) {
      const activeTabElement = activeTabRef.current;

      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;

        // Must match horizontal padding on root container (`px-2` => 8px)
        const clipLeft = offsetLeft + 8;
        const clipRight = offsetLeft + offsetWidth + 8;

        container.style.clipPath = `inset(0 ${Number(100 - (clipRight / container.offsetWidth) * 100).toFixed()}% 0 ${Number((clipLeft / container.offsetWidth) * 100).toFixed()}% round 14px)`;
      }
    }
  }, [activeValue]);

  const setValue = (next: string) => {
    if (disabled) return;
    onValueChange?.(next);
    if (!isControlled) setInternalValue(next);
  };

  return (
    <div className={["relative bg-secondary/50 border border-primary/10 flex w-fit flex-col items-center rounded-full py-1 px-2", className].filter(Boolean).join(" ")}>
      <div ref={containerRef} className="absolute z-10 w-full overflow-hidden [clip-path:inset(0px_75%_0px_0%_round_17px)] [transition:clip-path_0.25s_ease]">
        <div className="relative flex w-full justify-center bg-primary">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setValue(tab.value)}
              className="flex h-7 items-center rounded-full px-2.5 text-xs font-medium text-primary-foreground"
              tabIndex={-1}
              type="button"
              aria-hidden
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex w-full justify-center">
        {tabs.map(({ label, value: tabValue }, index) => {
          const isActive = activeValue === tabValue;

          return (
            <button
              key={index}
              ref={isActive ? activeTabRef : null}
              onClick={() => setValue(tabValue)}
              className="flex h-7 items-center cursor-pointer rounded-full px-2.5 text-xs font-medium text-muted-foreground"
              type="button"
              aria-pressed={isActive}
              disabled={disabled}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
