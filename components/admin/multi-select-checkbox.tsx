import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button-shadcn";
import { Command, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";

interface Option {
  id: string;
  name: string;
}

interface MultiSelectCheckboxProps {
  options: Option[];
  value: string[];
  onChange: (newValue: string[]) => void;
}

export function MultiSelectCheckbox({ options, value, onChange }: MultiSelectCheckboxProps) {
  const selectedLabels =
    options
      .filter((opt) => value.includes(opt.id))
      .map((opt) => opt.name)
      .join(", ") || "Select...";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between items-center ">
          {selectedLabels}
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0">
        <Command>
          <CommandEmpty>No platform found.</CommandEmpty>
          <CommandList>
            {options.map((option) => {
              const isChecked = value.includes(option.id);
              return (
                <CommandItem
                  key={option.id}
                  onSelect={() => {
                    if (isChecked) {
                      onChange(value.filter((v) => v !== option.id));
                    } else {
                      onChange([...value, option.id]);
                    }
                  }}
                >
                  <Checkbox
                    checked={isChecked}
                    className="mr-2"
                    onCheckedChange={() => {
                      if (isChecked) {
                        onChange(value.filter((v) => v !== option.id));
                      } else {
                        onChange([...value, option.id]);
                      }
                    }}
                  />
                  {option.name}
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
