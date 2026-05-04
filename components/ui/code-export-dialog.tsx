"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CodeBlock, CodeBlockCopyButton } from "@/components/ui/code-block";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type CodeExportFile = {
  name: string;
  code: string;
  language?: string;
};

type CodeExportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  loadFiles: () => Promise<CodeExportFile[]>;
};

export function CodeExportDialog({ open, onOpenChange, title, description, loadFiles }: CodeExportDialogProps) {
  const [files, setFiles] = useState<CodeExportFile[]>([]);
  const [activeFile, setActiveFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!files.length) {
      setActiveFile("");
      return;
    }

    if (!files.some((file) => file.name === activeFile)) {
      setActiveFile(files[0]?.name ?? "");
    }
  }, [activeFile, files]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let isActive = true;

    async function load() {
      setIsLoading(true);

      try {
        const nextFiles = await loadFiles();

        if (!isActive) return;

        setFiles(nextFiles);
        setActiveFile(nextFiles[0]?.name ?? "");
      } catch (error) {
        if (!isActive) return;

        toast.error(error instanceof Error ? error.message : "Failed to load export code.");
        onOpenChange(false);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      isActive = false;
    };
  }, [open]);

  const loadingFile: CodeExportFile = {
    name: "main.tsx",
    code: "// Loading export code...",
    language: "tsx",
  };

  const currentFiles = isLoading ? [loadingFile] : files;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl gap-0 p-0">
        <DialogHeader className="border-b border-border/70 px-6 py-5">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5">
          <Tabs value={isLoading ? loadingFile.name : activeFile} onValueChange={setActiveFile} className="gap-4">
            <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-xl bg-muted/60 p-1">
              {currentFiles.map((file) => (
                <TabsTrigger key={file.name} value={file.name} className="flex-none rounded-lg px-3 py-2">
                  {file.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {currentFiles.map((file) => (
              <TabsContent key={file.name} value={file.name}>
                <CodeBlock code={file.code} language={file.language ?? "tsx"} showLineNumbers>
                  <CodeBlockCopyButton onCopy={() => toast.success(`${file.name} copied.`)} onError={() => toast.error(`Failed to copy ${file.name}.`)} />
                </CodeBlock>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <DialogFooter className="border-t border-border/70 px-6 py-4">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
