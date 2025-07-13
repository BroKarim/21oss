"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { categories, getScreenshotsByCategory } from "@/data/mock-data";
import Image from "next/image";
import { CategoryType, ScreenshotType } from "@/types/globals";

interface ToolViewerContextProps {
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
}

export interface ToolViewerData {
  categories: CategoryType[];
  screenshots: ScreenshotType[];
}

export interface ToolViewerProviderProps extends ToolViewerData {
  children: ReactNode;
}

export type ToolViewerProps = ToolViewerData;

const ToolViewerContext = createContext<ToolViewerContextProps | undefined>(undefined);

function ToolViewerProvider({ categories, screenshots, children }: ToolViewerProviderProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  return (
    <ToolViewerContext.Provider
      value={{
        selectedCategoryId,
        setSelectedCategoryId,
        categories,
        screenshots,
      }}
    >
      {children}
    </ToolViewerContext.Provider>
  );
}

// Hook agar mudah digunakan di komponen lain
export function useToolViewer() {
  const context = useContext(ToolViewerContext);
  if (!context) {
    throw new Error("useToolViewer must be used within a ToolViewerProvider");
  }
  return context;
}

function ToolViewerFile() {
  const { selectedCategoryId, setSelectedCategoryId } = useToolViewer();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["starting-fundraiser", "edit-fundraiser", "donations"]));

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategoryClick = (categoryId: string, hasSubcategories: boolean) => {
    if (hasSubcategories) {
      toggleCategory(categoryId);
    }
    setSelectedCategoryId(categoryId);
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    setSelectedCategoryId(subcategoryId);
  };

  return (
    <div className="w-80  border-[#333]">
      <div className="p-3 border-b border-[#333]">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-[#cccccc]">EXPLORER</h2>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="p-2">
          {categories.map((category) => {
            const hasSubcategories = category.subcategories && category.subcategories.length > 0;
            const isExpanded = expandedCategories.has(category.id);
            const isSelected = selectedCategoryId === category.id;

            return (
              <div key={category.id} className="mb-1">
                <Collapsible open={isExpanded} onOpenChange={() => toggleCategory(category.id)}>
                  <div className="flex items-center group">
                    {hasSubcategories && (
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-[#2a2a2a]">
                          {isExpanded ? <ChevronDown className="h-3 w-3 text-[#cccccc]" /> : <ChevronRight className="h-3 w-3 text-[#cccccc]" />}
                        </Button>
                      </CollapsibleTrigger>
                    )}

                    <Button
                      variant="ghost"
                      className={`flex-1 justify-between h-7 px-2 py-1 text-left font-normal hover:bg-[#2a2a2a] ${isSelected ? "bg-[#37373d]" : ""} ${!hasSubcategories ? "ml-6" : "ml-1"}`}
                      onClick={() => handleCategoryClick(category.id, !!hasSubcategories)}
                    >
                      <span className="text-sm text-[#cccccc] truncate">{category.name}</span>
                      {category.count > 0 && (
                        <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-[#3c3c3c] text-[#cccccc] border-none">
                          {category.count}
                        </Badge>
                      )}
                    </Button>
                  </div>

                  {hasSubcategories && (
                    <CollapsibleContent className="ml-4">
                      {category.subcategories?.map((subcategory) => {
                        const isSubSelected = selectedCategoryId === subcategory.id;
                        return (
                          <Button
                            key={subcategory.id}
                            variant="ghost"
                            className={`w-full justify-between h-7 px-2 py-1 text-left font-normal hover:bg-[#2a2a2a] ml-2 ${isSubSelected ? "bg-[#37373d]" : ""}`}
                            onClick={() => handleSubcategoryClick(subcategory.id)}
                          >
                            <span className="text-sm text-[#cccccc] truncate">{subcategory.name}</span>
                            <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-[#3c3c3c] text-[#cccccc] border-none">
                              {subcategory.count}
                            </Badge>
                          </Button>
                        );
                      })}
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

function ToolViewerImage() {
  const { selectedCategoryId } = useToolViewer();
  const screenshots = selectedCategoryId ? getScreenshotsByCategory(selectedCategoryId) : [];

  if (!selectedCategoryId) {
    return (
      <div className="flex-1 bg-[#0d1117] flex items-center justify-center">
        <div className="text-center text-[#7d8590]">
          <h3 className="text-lg font-medium mb-2">Select a category</h3>
          <p className="text-sm">Choose a category from the sidebar to view mobile app screenshots</p>
        </div>
      </div>
    );
  }

  if (screenshots.length === 0) {
    return (
      <div className="flex-1  flex items-center justify-center">
        <div className="text-center text-[#7d8590]">
          <h3 className="text-lg font-medium mb-2">No screenshots available</h3>
          <p className="text-sm">This category doesnt contain any screenshots yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden ">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-6 px-6 pb-4">
          {screenshots.map((screenshot) => (
            <div key={screenshot.id} className="flex-shrink-0 group cursor-pointer">
              <div className="relative w-[280px] h-[560px] rounded-2xl overflow-hidden bg-black shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                <Image src={screenshot.imageUrl} alt={screenshot.title} fill className="object-cover transition-transform duration-300 group-hover:scale-110" sizes="280px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

function ToolViewer({ categories, screenshots }: ToolViewerProps) {
  return (
    <ToolViewerProvider categories={categories} screenshots={screenshots}>
      <div className="w-full flex h-screen">
        <ToolViewerFile />
        <ToolViewerImage />
      </div>
    </ToolViewerProvider>
  );
}

export { ToolViewer };
