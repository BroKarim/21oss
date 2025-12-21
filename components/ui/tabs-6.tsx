"use client";

import React, { forwardRef, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const XScrollable = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children?: ReactNode;
    showScrollbar?: boolean;
    contentClassName?: string;
  } & React.HTMLAttributes<HTMLDivElement>
>(({ className, children, showScrollbar = true, contentClassName, ...props }, ref) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    dragging.current = true;
    startX.current = e.clientX;
    startScrollLeft.current = scrollRef.current.scrollLeft;
  };
  const endDrag = () => {
    dragging.current = false;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || !scrollRef.current) return;
    e.preventDefault();
    const dx = e.clientX - startX.current;
    scrollRef.current.scrollLeft = startScrollLeft.current - dx;
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!scrollRef.current) return;
    // Convert vertical wheel to horizontal scroll when relevant
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (delta !== 0) {
      e.preventDefault();
      scrollRef.current.scrollLeft += delta;
    }
  };

  return (
    <div ref={ref} className={cn("relative", className)} {...props} onMouseLeave={endDrag} onMouseUp={endDrag} onMouseMove={onMouseMove}>
      {/* Optional scrollbar hiding styles */}
      {!showScrollbar && (
        <style>{`
          .x-scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
          .x-scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>
      )}

      <div
        ref={scrollRef}
        className={cn("overflow-x-auto overflow-y-hidden whitespace-nowrap", !showScrollbar && "x-scrollbar-hide", contentClassName)}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        role="group"
        aria-label="Horizontal scroll area"
      >
        {children}
      </div>
    </div>
  );
});
XScrollable.displayName = "XScrollable";

// Base Tabs component (Root)
const Tabs = forwardRef<
  HTMLDivElement,
  {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
    children?: ReactNode;
  }
>(({ defaultValue, value, onValueChange, className, children, ...props }, ref) => {
  const [activeValue, setActiveValue] = useState(value || defaultValue || "");

  useEffect(() => {
    if (value !== undefined) {
      setActiveValue(value);
    }
  }, [value]);

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (value === undefined) {
        setActiveValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [onValueChange, value]
  );

  return (
    <div ref={ref} className={cn("tabs-container", className)} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        // Only pass tab-related props to tab components
        const childType = child.type;
        const isTabComponent =
          childType === TabsList ||
          childType === TabsTrigger ||
          childType === TabsContent ||
          (typeof childType === "function" && ((childType as any).displayName === "TabsList" || (childType as any).displayName === "TabsTrigger" || (childType as any).displayName === "TabsContent"));

        if (isTabComponent) {
          return React.cloneElement(
            child as React.ReactElement<{
              activeValue?: string;
              onValueChange?: (value: string) => void;
              className?: string;
              children?: ReactNode;
              [key: string]: any;
            }>,
            {
              activeValue,
              onValueChange: handleValueChange,
            }
          );
        }

        return child;
      })}
    </div>
  );
});
Tabs.displayName = "Tabs";

// TabsList component
const TabsList = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    activeValue?: string;
    onValueChange?: (value: string) => void;
    children?: ReactNode;
    showHoverEffect?: boolean;
    showActiveIndicator?: boolean;
    activeIndicatorPosition?: "top" | "bottom";
    activeIndicatorOffset?: number;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "pills" | "underlined";
    stretch?: boolean;
    ariaLabel?: string;
    showBottomBorder?: boolean;
    bottomBorderClassName?: string;
    activeIndicatorClassName?: string;
    hoverIndicatorClassName?: string;
  }
>(
  (
    {
      className,
      activeValue,
      onValueChange,
      children,
      showHoverEffect = true,
      showActiveIndicator = true,
      activeIndicatorPosition = "bottom",
      activeIndicatorOffset = 0,
      size = "sm",
      variant = "default",
      stretch = false,
      ariaLabel = "Tabs",
      showBottomBorder = false,
      bottomBorderClassName,
      activeIndicatorClassName,
      hoverIndicatorClassName,
      ...props
    },
    ref
  ) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [hoverStyle, setHoverStyle] = useState({});
    const [activeStyle, setActiveStyle] = useState({
      left: "0px",
      width: "0px",
    });
    const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    // Find active tab index based on value
    const activeIndex = React.Children.toArray(children).findIndex((child) => React.isValidElement(child) && (child as React.ReactElement<{ value: string }>).props.value === activeValue);

    // Update hover indicator position
    useEffect(() => {
      if (hoveredIndex !== null && showHoverEffect) {
        const hoveredElement = tabRefs.current[hoveredIndex];
        if (hoveredElement) {
          const { offsetLeft, offsetWidth } = hoveredElement;
          setHoverStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          });
        }
      }
    }, [hoveredIndex, showHoverEffect]);

    // Update active indicator position
    const updateActiveIndicator = useCallback(() => {
      if (showActiveIndicator && activeIndex >= 0) {
        const activeElement = tabRefs.current[activeIndex];
        if (activeElement) {
          const { offsetLeft, offsetWidth } = activeElement;
          setActiveStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          });
        }
      }
    }, [activeIndex, showActiveIndicator]);

    useEffect(() => {
      updateActiveIndicator();
    }, [activeIndex, updateActiveIndicator]);

    useEffect(() => {
      requestAnimationFrame(updateActiveIndicator);
    }, [updateActiveIndicator]);

    // Function to scroll tab to center
    const scrollTabToCenter = (index: number) => {
      const tabElement = tabRefs.current[index];
      const scrollContainer = scrollContainerRef.current;

      if (tabElement && scrollContainer) {
        const containerWidth = scrollContainer.offsetWidth;
        const tabWidth = tabElement.offsetWidth;
        const tabLeft = tabElement.offsetLeft;
        const scrollTarget = tabLeft - containerWidth / 2 + tabWidth / 2;
        scrollContainer.scrollTo({ left: scrollTarget, behavior: "smooth" });
      }
    };

    // Size classes
    const sizeClasses = {
      sm: "h-[32px] text-sm",
      md: "h-[40px] text-base",
      lg: "h-[48px] text-lg",
    };

    // Variant classes
    const variantClasses = {
      default: "",
      pills: "rounded-full",
      underlined: "",
    };

    // Active indicator classes
    const activeIndicatorClasses = {
      default: "h-[4px] bg-neutral-500 dark:bg-neutral-500",
      pills: "hidden",
      underlined: "h-[4px] bg-neutral-500 dark:bg-neutral-500",
    };

    // Hover indicator classes
    const hoverIndicatorClasses = {
      default: "bg-neutral-400 dark:bg-muted rounded-[6px]",
      pills: "bg-muted dark:bg-muted rounded-full",
      underlined: "bg-muted dark:bg-muted rounded-[6px]",
    };

    const setTabRef = useCallback((el: HTMLDivElement | null, index: number) => {
      tabRefs.current[index] = el;
    }, []);

    // Save a reference to the scroll container when it's mounted
    const handleScrollableRef = useCallback((node: HTMLDivElement | null) => {
      if (node) {
        const scrollableDiv = node.querySelector('div[class*="overflow-x-auto"]');
        if (scrollableDiv) {
          scrollContainerRef.current = scrollableDiv as HTMLDivElement;
        }
      }
    }, []);

    // Center the active tab on initial render only
    useEffect(() => {
      if (activeIndex >= 0) {
        const timer = setTimeout(() => {
          scrollTabToCenter(activeIndex);
        }, 100);
        return () => clearTimeout(timer);
      }
    }, []); // run once

    return (
      <div ref={handleScrollableRef} className={cn("relative", className)} role="tablist" aria-label={ariaLabel} {...props}>
        <XScrollable showScrollbar={false}>
          <div className={cn("relative", showBottomBorder && "pb-px")}>
            {showBottomBorder && <div className={cn("absolute bottom-0 left-0 right-0 h-px bg-border dark:bg-border", bottomBorderClassName)} />}

            {showHoverEffect && (
              <div
                className={cn("absolute transition-all duration-300 ease-out flex items-center z-0", sizeClasses[size], hoverIndicatorClasses[variant], hoverIndicatorClassName)}
                style={{
                  ...hoverStyle,
                  opacity: hoveredIndex !== null ? 1 : 0,
                  transition: "all 300ms ease-out",
                }}
                aria-hidden="true"
              />
            )}

            <div ref={ref} className={cn("relative flex items-center", stretch ? "w-full" : "", variant === "default" ? "space-x-[6px]" : "space-x-[2px]")}>
              {React.Children.map(children, (child, index) => {
                if (!React.isValidElement(child)) return child;

                const props = (
                  child as React.ReactElement<{
                    value: string;
                    disabled?: boolean;
                    label?: string;
                    className?: string;
                    activeClassName?: string;
                    inactiveClassName?: string;
                    disabledClassName?: string;
                  }>
                ).props;

                const { value, disabled } = props;
                const isActive = value === activeValue;

                return (
                  <div
                    key={value}
                    ref={(el) => setTabRef(el, index)}
                    className={cn(
                      "px-3 py-2 sm:mb-1.5 mb-2 cursor-pointer transition-colors duration-300",
                      sizeClasses[size],
                      variant === "pills" && isActive ? "bg-neutral-500 dark:bg-neutral-500 rounded-full" : "",
                      disabled ? "opacity-50 cursor-not-allowed" : "",
                      stretch ? "flex-1 text-center" : "",
                      isActive ? props.activeClassName || "text-foreground dark:text-foreground" : props.inactiveClassName || "text-muted-foreground dark:text-muted-foreground",
                      disabled && props.disabledClassName,
                      variantClasses[variant],
                      props.className
                    )}
                    onMouseEnter={() => !disabled && setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => {
                      if (!disabled) {
                        onValueChange?.(value);
                        scrollTabToCenter(index);
                      }
                    }}
                    role="tab"
                    aria-selected={isActive}
                    aria-disabled={disabled}
                    aria-controls={`tabpanel-${value}`}
                    id={`tab-${value}`}
                    tabIndex={isActive ? 0 : -1}
                  >
                    <div className="whitespace-nowrap flex items-center justify-center h-full">{child}</div>
                  </div>
                );
              })}
            </div>

            {showActiveIndicator && variant !== "pills" && activeIndex >= 0 && (
              <div
                className={cn("absolute transition-all duration-300 ease-out z-10", activeIndicatorClasses[variant], activeIndicatorPosition === "top" ? "top-[-1px]" : "bottom-[-1px]", activeIndicatorClassName)}
                style={{
                  ...activeStyle,
                  transition: "all 300ms ease-out z-50",
                  [activeIndicatorPosition]: `${activeIndicatorOffset}px`,
                }}
                aria-hidden="true"
              />
            )}
          </div>
        </XScrollable>
      </div>
    );
  }
);
TabsList.displayName = "TabsList";

// TabsTrigger component
const TabsTrigger = forwardRef<
  HTMLDivElement,
  {
    value: string;
    disabled?: boolean;
    label?: string;
    className?: string;
    activeClassName?: string;
    inactiveClassName?: string;
    disabledClassName?: string;
    activeValue?: string;
    onValueChange?: (value: string) => void;
    children?: ReactNode;
  }
>(({ label, className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={className} {...props}>
      {label || children}
    </div>
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = forwardRef<
  HTMLDivElement,
  {
    value: string;
    className?: string;
    activeValue?: string;
    onValueChange?: (value: string) => void;
    children: ReactNode;
  }
>(({ value, className, activeValue, children, ...props }, ref) => {
  if (value !== activeValue) return null;
  return (
    <div ref={ref} role="tabpanel" id={`tabpanel-${value}`} aria-labelledby={`tab-${value}`} className={className} {...props}>
      {children}
    </div>
  );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
