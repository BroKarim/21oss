"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { FileIcon, FolderIcon, FolderOpenIcon, Github } from "lucide-react";
import React, { createContext, forwardRef, useCallback, useContext, useEffect, useState } from "react";
import { FlowNode } from "@/types/globals";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type TreeViewElement = {
  id: string;
  name: string;
  isSelectable?: boolean;
  type: "folder" | "file";
  repositoryPath?: string;
  children?: TreeViewElement[];
};

export function flowNodesToTreeElements(nodes: FlowNode[]): TreeViewElement[] {
  return nodes.map((node) => ({
    id: node.id,
    name: node.label,
    isSelectable: true,
    type: node.children && node.children.length > 0 ? "folder" : "file",
    repositoryPath: node.repositoryPath ?? undefined,
    children: node.children ? flowNodesToTreeElements(node.children) : [],
  }));
}

type TreeContextProps = {
  selectedId: string | undefined;
  expandedItems: string[] | undefined;
  indicator: boolean;
  handleExpand: (id: string) => void;
  selectItem: (id: string) => void;
  setExpandedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  direction: "rtl" | "ltr";
};

const TreeContext = createContext<TreeContextProps | null>(null);

const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("useTree must be used within a TreeProvider");
  }
  return context;
};

interface TreeViewComponentProps extends React.HTMLAttributes<HTMLDivElement> {}

type Direction = "rtl" | "ltr" | undefined;

type TreeViewProps = {
  initialSelectedId?: string;
  indicator?: boolean;
  elements?: TreeViewElement[];
  initialExpandedItems?: string[];
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
} & TreeViewComponentProps;

const Tree = forwardRef<HTMLDivElement, TreeViewProps>(({ className, elements, initialSelectedId, initialExpandedItems, children, indicator = true, openIcon, closeIcon, dir, ...props }, ref) => {
  const [selectedId, setSelectedId] = useState<string | undefined>(initialSelectedId);
  const [expandedItems, setExpandedItems] = useState<string[] | undefined>(initialExpandedItems);

  const selectItem = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleExpand = useCallback((id: string) => {
    setExpandedItems((prev) => {
      if (prev?.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...(prev ?? []), id];
    });
  }, []);

  const expandSpecificTargetedElements = useCallback((elements?: TreeViewElement[], selectId?: string) => {
    if (!elements || !selectId) return;
    const findParent = (currentElement: TreeViewElement, currentPath: string[] = []) => {
      const isSelectable = currentElement.isSelectable ?? true;
      const newPath = [...currentPath, currentElement.id];
      if (currentElement.id === selectId) {
        if (isSelectable) {
          setExpandedItems((prev) => [...(prev ?? []), ...newPath]);
        } else {
          if (newPath.includes(currentElement.id)) {
            newPath.pop();
            setExpandedItems((prev) => [...(prev ?? []), ...newPath]);
          }
        }
        return;
      }
      if (isSelectable && currentElement.children && currentElement.children.length > 0) {
        currentElement.children.forEach((child) => {
          findParent(child, newPath);
        });
      }
    };
    elements.forEach((element) => {
      findParent(element);
    });
  }, []);

  useEffect(() => {
    if (initialSelectedId) {
      expandSpecificTargetedElements(elements, initialSelectedId);
    }
  }, [initialSelectedId, elements]);

  const direction = dir === "rtl" ? "rtl" : "ltr";

  return (
    <TreeContext.Provider
      value={{
        selectedId,
        expandedItems,
        handleExpand,
        selectItem,
        setExpandedItems,
        indicator,
        openIcon,
        closeIcon,
        direction,
      }}
    >
      <div className={cn("size-full", className)}>
        <ScrollArea ref={ref} className="relative h-full px-2" dir={dir as Direction}>
          <AccordionPrimitive.Root
            {...props}
            type="multiple"
            defaultValue={expandedItems}
            value={expandedItems}
            className="flex flex-col gap-1"
            onValueChange={(value) => setExpandedItems((prev) => [...(prev ?? []), value[0]])}
            dir={dir as Direction}
          >
            {children}
          </AccordionPrimitive.Root>
        </ScrollArea>
      </div>
    </TreeContext.Provider>
  );
});

Tree.displayName = "Tree";

const TreeIndicator = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const { direction } = useTree();

  return <div dir={direction} ref={ref} className={cn("absolute left-1.5 h-full w-px rounded-md bg-white/75 py-3 duration-300 ease-in-out hover:bg-slate-300 rtl:right-1.5", className)} {...props} />;
});

TreeIndicator.displayName = "TreeIndicator";

interface FolderComponentProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {}

type FolderProps = {
  expandedItems?: string[];
  element: string;
  isSelectable?: boolean;
  isSelect?: boolean;
} & FolderComponentProps;

const Folder = forwardRef<HTMLDivElement, FolderProps & React.HTMLAttributes<HTMLDivElement>>(({ className, element, value, isSelectable = true, isSelect, children, ...props }, ref) => {
  const { direction, handleExpand, expandedItems, indicator, setExpandedItems, openIcon, closeIcon } = useTree();

  return (
    <AccordionPrimitive.Item {...props} value={value} className="relative h-full overflow-hidden">
      <AccordionPrimitive.Trigger
        className={cn(`flex items-center gap-1 rounded-md text-sm`, className, {
          "bg-muted rounded-md": isSelect && isSelectable,
          "cursor-pointer": isSelectable,
          "cursor-not-allowed opacity-50": !isSelectable,
        })}
        disabled={!isSelectable}
        onClick={() => handleExpand(value)}
      >
        {expandedItems?.includes(value) ? (openIcon ?? <FolderOpenIcon className="size-4" />) : (closeIcon ?? <FolderIcon className="size-4" />)}
        <span>{element}</span>
      </AccordionPrimitive.Trigger>
      <AccordionPrimitive.Content className="relative h-full overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        {element && indicator && <TreeIndicator aria-hidden="false" />}
        <AccordionPrimitive.Root
          dir={direction}
          type="multiple"
          className="ml-5 flex flex-col gap-2 py-2 rtl:mr-5 "
          defaultValue={expandedItems}
          value={expandedItems}
          onValueChange={(value) => {
            setExpandedItems?.((prev) => [...(prev ?? []), value[0]]);
          }}
        >
          {children}
        </AccordionPrimitive.Root>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
});

Folder.displayName = "Folder";

const File = forwardRef<
  HTMLButtonElement,
  {
    value: string;
    handleSelect?: (id: string) => void;
    isSelectable?: boolean;
    isSelect?: boolean;
    fileIcon?: React.ReactNode;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ value, className, handleSelect, isSelectable = true, isSelect, fileIcon, children, ...props }, ref) => {
  const { direction, selectedId, selectItem } = useTree();
  const isSelected = isSelect ?? selectedId === value;
  return (
    <button
      ref={ref}
      type="button"
      disabled={!isSelectable}
      className={cn(
        "flex w-fit items-center gap-1 rounded-md pr-1 text-sm duration-200 ease-in-out rtl:pl-1 rtl:pr-0",
        {
          "bg-muted": isSelected && isSelectable,
        },
        isSelectable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
        direction === "rtl" ? "rtl" : "ltr",
        className
      )}
      onClick={() => selectItem(value)}
      {...props}
    >
      {fileIcon ?? <Github className="size-4" />}
      {children}
    </button>
  );
});

File.displayName = "File";

const CollapseButton = forwardRef<
  HTMLButtonElement,
  {
    elements: TreeViewElement[];
    expandAll?: boolean;
  } & React.HTMLAttributes<HTMLButtonElement>
>(({ className, elements, expandAll = false, children, ...props }, ref) => {
  const { expandedItems, setExpandedItems } = useTree();

  const expendAllTree = useCallback((elements: TreeViewElement[]) => {
    const expandTree = (element: TreeViewElement) => {
      const isSelectable = element.isSelectable ?? true;
      if (isSelectable && element.children && element.children.length > 0) {
        setExpandedItems?.((prev) => [...(prev ?? []), element.id]);
        element.children.forEach(expandTree);
      }
    };

    elements.forEach(expandTree);
  }, []);

  const closeAll = useCallback(() => {
    setExpandedItems?.([]);
  }, []);

  useEffect(() => {
    console.log(expandAll);
    if (expandAll) {
      expendAllTree(elements);
    }
  }, [expandAll]);

  return (
    <Button variant={"ghost"} className="absolute bottom-1 right-2 h-8 w-fit p-1" onClick={expandedItems && expandedItems.length > 0 ? closeAll : () => expendAllTree(elements)} ref={ref} {...props}>
      {children}
      <span className="sr-only">Toggle</span>
    </Button>
  );
});

CollapseButton.displayName = "CollapseButton";

function renderTree(elements?: TreeViewElement[]): React.ReactNode {
  if (!elements) return null;

  return elements.map((element) => {
    if (element.type === "folder") {
      return (
        <Folder key={element.id} value={element.id} element={element.name}>
          {renderTree(element.children)}
        </Folder>
      );
    }

    return (
      <Link key={element.id} href={element.repositoryPath ?? "#"} target="_blank" rel="noopener noreferrer" className="no-underline">
        <File value={element.id}>{element.name}</File>
      </Link>
    );
  });
}

export { CollapseButton, File, Folder, Tree, renderTree, type TreeViewElement };
