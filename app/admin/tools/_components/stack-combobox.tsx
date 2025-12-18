"use client";

import * as React from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button-shadcn";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useServerAction } from "zsa-react"; // atau safe-actions kalau kamu pakai itu
import { createStack } from "@/server/admin/stacks/action";
type StackOption = {
  id: string;
  name: string;
  slug: string;
};

type StackComboboxProps = {
  options: StackOption[];
  onSelect: (stack: StackOption) => void; // ✅ Ubah dari slug ke StackOption
};

export function StackCombobox({ options, onSelect }: StackComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const createStackAction = useServerAction(createStack, {
    onSuccess: ({ data }) => {
      onSelect({
        id: data.id,
        name: data.name,
        slug: data.slug,
      });
      setOpen(false);
      setInputValue("");
    },
    onError: (err) => {
      console.log("Gagal menambahkan stack: ", err);
    },
  });

  const handleSelect = (value: string) => {
    const existing = options.find((opt) => opt.slug === value);
    if (existing) {
      onSelect(existing);
      setOpen(false);
      setInputValue("");
    } else {
      createStackAction.execute({ name: value });
    }
  };

  const filtered = inputValue ? options.filter((opt) => opt.name.toLowerCase().includes(inputValue.toLowerCase())) : options;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          Stack
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Cari atau buat stack baru..." value={inputValue} onValueChange={setInputValue} />
          <CommandList>
            <CommandEmpty>Tidak ditemukan</CommandEmpty>
            <CommandGroup>
              {filtered.map((opt) => (
                <CommandItem key={opt.slug} value={opt.slug} onSelect={() => handleSelect(opt.slug)}>
                  {opt.name}
                  <Check className={cn("ml-auto h-4 w-4", false ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
              {inputValue && !filtered.some((opt) => opt.name === inputValue) && (
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
