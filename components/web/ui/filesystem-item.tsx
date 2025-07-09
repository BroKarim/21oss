"use client";

import { useState } from "react";
import { ChevronRight, Folder, File } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Node = {
  name: string;
  nodes?: Node[];
};

interface FilesystemItemProps {
  node: Node;
  animated?: boolean;
}

export function FilesystemItem({ node, animated = false }: FilesystemItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const ChevronIcon = () =>
    animated ? (
      <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="flex">
        <ChevronRight className="size-4 text-gray-500" />
      </motion.span>
    ) : (
      <ChevronRight className={`size-4 text-gray-500 ${isOpen ? "rotate-90" : ""}`} />
    );

  const ChildrenList = () => {
    const children = node.nodes?.map((node) => <FilesystemItem node={node} key={node.name} animated={animated} />);

    if (animated) {
      return (
        <AnimatePresence>
          {isOpen && (
            <motion.ul initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="pl-6 overflow-hidden flex flex-col justify-end">
              {children}
            </motion.ul>
          )}
        </AnimatePresence>
      );
    }

    return isOpen && <ul className="pl-6">{children}</ul>;
  };

  return (
    <li key={node.name}>
      <span className="flex items-center gap-1.5 py-1">
        {node.nodes && node.nodes.length > 0 && (
          <button onClick={() => setIsOpen(!isOpen)} className="p-1 -m-1">
            <ChevronIcon />
          </button>
        )}

        {node.nodes ? <Folder className={`size-6 text-sky-500 fill-sky-500 ${node.nodes.length === 0 ? "ml-[22px]" : ""}`} /> : <File className="ml-[22px] size-6 text-gray-900" />}
        {node.name}
      </span>

      <ChildrenList />
    </li>
  );
}
