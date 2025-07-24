import { ToolStatus } from "@prisma/client";
import { type ComponentProps, type ReactNode, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

export const ToolPublishActions = ({ tool, isPending, isStatusPending, onStatusSubmit, children, ...props }: ToolPublishActionsProps) => {
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
      },
    ],
  };

  const actions = toolActions[status] || toolActions[ToolStatus.Draft];

  return (
    <Stack direction="row" className="gap-2">
      {actions.map((action) => (
        <Popover key={String(action.children)} open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button size="md" isPending={action.type === "submit" ? isPending : isStatusPending} {...action} />
          </PopoverTrigger>
          {action.popover && (
            <PopoverContent align="center" side="top" sideOffset={8} className="w-72" onOpenAutoFocus={(e) => e.preventDefault()}>
              <Stack size="lg" direction="column" className="items-stretch gap-5 min-w-80">
                <Stack size="sm" direction="column">
                  <H5>{action.popover.title}</H5>
                  {action.popover.description && <Note>{action.popover.description}</Note>}
                </Stack>
                <RadioGroup defaultValue={currentStatus} className="contents" onValueChange={(value) => setCurrentStatus(value as ToolStatus)}>
                  {action.popover.options.map((option) => (
                    <Stack size="sm" className="items-start" key={option.status}>
                      <RadioGroupItem id={option.status} value={option.status} className="mt-0.5" />
                      <Stack size="sm" direction="column" className="grow" asChild>
                        <label htmlFor={option.status}>
                          <H6>{option.title}</H6>
                          {option.description && <Note>{option.description}</Note>}
                          {option.button && (
                            <Button onClick={option.button.onClick} variant="primary" className="mt-2">
                              {option.button.children}
                            </Button>
                          )}
                        </label>
                      </Stack>
                    </Stack>
                  ))}
                </RadioGroup>
              </Stack>
            </PopoverContent>
          )}
        </Popover>
      ))}
    </Stack>
  );
};
