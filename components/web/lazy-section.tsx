"use client";

import { useEffect, useRef, useState } from "react";
import { HomeSection } from "@/lib/constants/home-sections";
import { ToolMany } from "@/server/web/tools/payloads";
import * as toolsActions from "@/server/web/tools/actions";
import { sectionComponents } from "@/lib/constants/section-components";

  interface LazySectionProps {
    section: HomeSection;
  }

  interface SectionWithData extends Omit<HomeSection, "actionName"> {
    tools: ToolMany[] | null;
  }

  export default function LazySection({ section }: LazySectionProps) {
    const [sectionData, setSectionData] = useState<SectionWithData>({
      id: section.id,
      label: section.label,
      type: section.type,
      options: section.options,
      tools: null, // Initially null
    });
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;

        // Trigger when section is 50% visible
        if (entry.isIntersecting && !hasLoaded && !isLoading) {
          setIsLoading(true);

          try {
            console.log(`Loading data for section: ${section.label}`);

            // Dynamic call to server action based on actionName
            const actionFn = toolsActions[section.actionName as keyof typeof toolsActions];
            if (!actionFn) {
              throw new Error(`Action ${section.actionName} not found`);
            }

            const tools = await actionFn();

            setSectionData((prev) => ({
              ...prev,
              tools,
            }));

            setHasLoaded(true);
          } catch (error) {
            console.error(`Error loading section ${section.label}:`, error);
            setSectionData((prev) => ({
              ...prev,
              tools: [],
            }));
            setHasLoaded(true);
          } finally {
            setIsLoading(false);
          }
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
  }, [section, hasLoaded, isLoading]);

  // Loading skeleton
  if (isLoading || !hasLoaded) {
    return (
      <div ref={sectionRef} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{section.label}</h2>
        </div>

        {/* Loading skeleton based on section type */}
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
  if (!sectionData.tools?.length) {
    return (
      <div ref={sectionRef} className="text-center text-gray-500 py-8">
        No tools available for {section.label}.
      </div>
    );
  }

  const Component = sectionComponents[section.type];
  const componentProps = {
    ...sectionData,
    tools: sectionData.tools || [],
  };
  return (
    <div ref={sectionRef}>
      <Component {...componentProps} />
    </div>
  );
}
