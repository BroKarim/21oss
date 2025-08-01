import { ToolStatus } from "@prisma/client";
import { type ComponentProps, type ReactNode, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button, type ButtonProps } from "@/components/ui/button";
import { H5, H6 } from "@/components/ui/heading";
import { Note } from "@/components/ui/note";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Stack } from "@/components/ui/stack";
import type { findToolBySlug } from "@/server/admin/tools/queries";
import type { ToolSchema } from "@/server/admin/tools/schema";
import { BadgeCheck } from "lucide-react";

type ToolPublishActionsProps = ComponentProps<typeof Stack> & {
  tool?: NonNullable<Awaited<ReturnType<typeof findToolBySlug>>>;
  isPending: boolean;
  isStatusPending: boolean;
  onStatusSubmit: (status: ToolStatus, publishedAt: Date | null) => void;
};

type PopoverOption = {
  status: ToolStatus;
  title: ReactNode;
  description?: ReactNode;
  button?: ButtonProps;
};

type ActionConfig = Omit<ButtonProps, "popover"> & {
  popover?: {
    title: ReactNode;
    description?: ReactNode;
    options: PopoverOption[];
  };
};

export const ToolPublishActions = ({ isPending, isStatusPending, onStatusSubmit, tool, children, ...props }: ToolPublishActionsProps) => {
  const { watch } = useFormContext<ToolSchema>();
  const [status] = watch(["status", "publishedAt"]);

  const [isOpen, setIsOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  const handlePublished = () => {
    onStatusSubmit(ToolStatus.Published, new Date());
    setIsOpen(false);
  };

  const handleDraft = () => {
    onStatusSubmit(ToolStatus.Draft, null);
    setIsOpen(false);
  };

  const toolActions: Record<ToolStatus, ActionConfig[]> = {
    [ToolStatus.Draft]: [
      {
        type: "button",
        children: "Publish",
        variant: "fancy",
        popover: {
          title: "Ready to publish this tool?",
          description: "Choose to publish or keep as draft.",
          options: [
            {
              status: ToolStatus.Published,
              title: "Publish now",
              description: "Set this tool live immediately",
              button: {
                onClick: handlePublished,
                children: "Publish",
              },
            },
            {
              status: ToolStatus.Draft,
              title: "Keep as draft",
              description: "Save without publishing",
              button: {
                onClick: handleDraft,
                children: "Save Draft",
              },
            },
          ],
        },
      },
      {
        type: "submit",
        children: "Save Draft",
        variant: "primary",
      },
    ],
    [ToolStatus.Published]: [
      {
        type: "button",
        children: "Published",
        variant: "secondary",
        prefix: <BadgeCheck />,
        popover: {
          title: "Update tool status",
          description: "Choose to keep published or revert to draft.",
          options: [
            {
              status: ToolStatus.Published,
              title: "Keep published",
              description: "Keep this tool publicly available",
            },
            {
              status: ToolStatus.Draft,
              title: "Unpublish",
              description: "Revert this tool to a draft",
              button: {
                onClick: handleDraft,
                children: "Unpublish",
              },
            },
          ],
        },
      },
      {
        type: "submit",
        children: "Update",
        variant: "primary",
        name: "submit",
      },
    ],
  };

  return (
    <Stack size="sm" {...props}>
      {children}

      {toolActions[tool?.status ?? ToolStatus.Draft].map(({ popover, ...action }) => {
        if (popover) {
          const opts = popover.options;
          const currentOption = opts.find((o) => o.status === currentStatus) || opts[0];

          return (
            <Popover key={String(action.children)} open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button size="md" isPending={isStatusPending} {...action} />
              </PopoverTrigger>

              <PopoverContent align="center" side="top" sideOffset={8} className="w-72" onOpenAutoFocus={(e) => e.preventDefault()} asChild>
                <Stack size="lg" direction="column" className="items-stretch gap-5 min-w-80">
                  <Stack size="sm" direction="column">
                    <H5>{popover.title}</H5>

                    {popover.description && <Note>{popover.description}</Note>}
                  </Stack>

                  <RadioGroup defaultValue={currentOption.status} className="contents" onValueChange={(value) => setCurrentStatus(value as ToolStatus)}>
                    {opts.map((option) => (
                      <Stack size="sm" className="items-start" key={option.status}>
                        <RadioGroupItem id={option.status} value={option.status} className="mt-0.5" />

                        <Stack size="sm" direction="column" className="grow" asChild>
                          <label htmlFor={option.status}>
                            <H6>{option.title}</H6>
                            {option.description && <Note>{option.description}</Note>}
                          </label>
                        </Stack>
                      </Stack>
                    ))}
                  </RadioGroup>

                  <Stack className="justify-between">
                    <Button size="md" variant="secondary" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>

                    {currentOption.button && <Button size="md" isPending={isStatusPending} {...currentOption.button} />}
                  </Stack>
                </Stack>
              </PopoverContent>
            </Popover>
          );
        }

        return <Button key={String(action.children)} name="submit" size="md" isPending={isPending} type="submit" className="lg:min-w-24" {...action} />;
      })}
    </Stack>
  );
};
