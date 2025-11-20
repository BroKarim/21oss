"use client";

import * as React from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button-shadcn";
import { ChevronsUpDown } from "lucide-react";

type TagComboboxProps = {
  options: string[];
  onSelect: (tag: string) => void;
};

export function TagCombobox({ options, onSelect }: TagComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleSelect = (value: string) => {
    onSelect(value);
    setOpen(false);
    setInputValue("");
  };

  const filtered = inputValue.length > 0 ? options.filter((t) => t.toLowerCase().includes(inputValue.toLowerCase())) : options;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          Tambah Tag
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Cari atau buat tag baru..." value={inputValue} onValueChange={setInputValue} />

          <CommandList>
            <CommandEmpty>Tidak ditemukan</CommandEmpty>

            <CommandGroup>
              {filtered.map((tag) => (
                <CommandItem key={tag} value={tag} onSelect={() => handleSelect(tag)}>
                  {tag}
                </CommandItem>
              ))}

              {inputValue && !filtered.some((t) => t.toLowerCase() === inputValue.toLowerCase()) && (
                <CommandItem value={inputValue} onSelect={() => handleSelect(inputValue)} className="text-primary">
                  Tambah baru: <strong className="ml-1">{inputValue}</strong>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
