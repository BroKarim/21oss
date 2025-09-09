"use client";

import { useServerAction } from "zsa-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import React from "react";

interface ReusableFetchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  action: (payload: any) => Promise<any>;
  buttonText: string;
  loadingText?: string;
  successMessage: string;
}

export function FetchButton({ action, buttonText, loadingText = "Fetching...", successMessage, ...props }: ReusableFetchButtonProps) {
  const { execute, isPending } = useServerAction(action, {
    onSuccess: () => toast.success(successMessage),
    onError: ({ err }) => toast.error(`❌ ${err.message}`),
  });

  return (
    <Button onClick={() => execute({})} disabled={isPending || props.disabled} {...props}>
      {isPending ? loadingText : buttonText}
    </Button>
  );
}
