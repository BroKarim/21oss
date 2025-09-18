"use client";

import { useEffect, useRef, useState } from "react";
import { ToolMany } from "@/server/web/tools/payloads";

import { sectionComponents } from "@/lib/constants/section-components";

interface SectionData {
  id: string;
  label: string;
  type: "slider" | "favicon" | "gallery";
  tools: ToolMany[];
  options: {
    showScroll?: boolean;
    showViewAll?: boolean;
    viewAllUrl?: string;
    loadMore?: boolean;
  };
}

interface LazySectionProps {
  section: SectionData;
}

export default function LazySection({ section }: LazySectionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsLoading(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);
  // Loading skeleton
  if (isLoading) {
    return (
      <div ref={sectionRef} className="space-y-4">
        <div className="flex items-center justify-between rounded-md">
          <h2 className="text-2xl font-bold">{section.label}</h2>
        </div>

        {section.type === "gallery" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {section.type === "slider" && (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-64 animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg mb-3"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // No tools found
  if (!section.tools?.length) {
    return (
      <div ref={sectionRef} className="text-center text-gray-500 py-8">
        No tools available for {section.label}.
      </div>
    );
  }

  const Component = sectionComponents[section.type];
  return (
    <div>
      <Component {...section} />
    </div>
  );
}
