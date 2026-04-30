"use client";

import * as React from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

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
  const isInitializedRef = useRef(false);
  const [clipPath, setClipPath] = useState("inset(0 100% 0 0 round 14px)");

  const syncIndicator = useCallback(() => {
    const container = containerRef.current;
    const activeTabElement = activeTabRef.current;

    if (!container || !activeTabElement || !activeValue) return;

    const { offsetLeft, offsetWidth } = activeTabElement;
    const clipLeft = offsetLeft + 8;
    const clipRight = offsetLeft + offsetWidth + 8;

    setClipPath(`inset(0 ${Number(100 - (clipRight / container.offsetWidth) * 100).toFixed()}% 0 ${Number((clipLeft / container.offsetWidth) * 100).toFixed()}% round 14px)`);
  }, [activeValue]);

  useLayoutEffect(() => {
    syncIndicator();
    isInitializedRef.current = true;
  }, [syncIndicator]);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => syncIndicator());
    observer.observe(container);

    const activeTabElement = activeTabRef.current;
    if (activeTabElement) observer.observe(activeTabElement);

    return () => observer.disconnect();
  }, [syncIndicator, activeValue]);

  const setValue = (next: string) => {
    if (disabled) return;
    onValueChange?.(next);
    if (!isControlled) setInternalValue(next);
  };

  return (
    <div className={["relative bg-secondary/50 border border-primary/10 flex w-fit flex-col items-center rounded-full py-1 px-2", className].filter(Boolean).join(" ")}>
      <div
        ref={containerRef}
        style={{
          clipPath,
          transition: isInitializedRef.current ? "clip-path 0.25s ease" : "none",
        }}
        className="absolute z-10 w-full overflow-hidden"
      >
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
