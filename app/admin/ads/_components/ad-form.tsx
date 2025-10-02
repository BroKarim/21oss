"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AdType } from "@prisma/client";
import { useForm } from "react-hook-form";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { H3 } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Stack } from "@/components/ui/stack";
import { Textarea } from "@/components/ui/textarea";
import { upsertAd } from "@/server/admin/ads/action";
import { findAdById } from "@/server/admin/ads/queries";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { adSchema } from "@/server/admin/ads/schema";

import { cx } from "@/lib/utils";

type AdsFormProps = ComponentProps<"form"> & {
  ad?: NonNullable<Awaited<ReturnType<typeof findAdById>>>;
};

export function AdForm({ className, title, ad, ...props }: AdsFormProps) {
  const form = useForm({
    resolver: zodResolver(adSchema),
    defaultValues: {
      email: ad?.email ?? undefined,
      name: ad?.name ?? "",
      description: ad?.description ?? "",
      websiteUrl: ad?.websiteUrl ?? "",
      affiliateUrl: ad?.affiliateUrl ?? "",
      imageUrl: ad?.imageUrl ?? "",
      buttonLabel: ad?.buttonLabel ?? "",
      faviconUrl: ad?.faviconUrl ?? "",
      type: ad?.type ?? AdType.All,
      startsAt: ad?.startsAt ? new Date(ad.startsAt).toISOString().split("T")[0] : undefined,
      endsAt: ad?.endsAt ? new Date(ad.endsAt).toISOString().split("T")[0] : undefined,
      subscriptionId: ad?.subscriptionId ?? undefined,
    },
  });

  const upsertAction = useServerAction(upsertAd, {
    onSuccess: () => {
      toast.success(`Ad successfully ${ad ? "updated" : "created"}`);
    },
    onError: ({ err }) => {
      console.error("🔥 upsertAction onError:", err);
      toast.error(err.message);
    },
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const isValid = await form.trigger();
      if (!isValid) {
        console.log("🔥 Validation errors:", JSON.stringify(form.formState.errors, null, 2));
        toast.error("Please fix the form errors before submitting.");
        return;
      }

      const formData = form.getValues();

      await upsertAction.execute({ id: ad?.id, ...formData });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit the form. Please try again.");
    }
  };

  return (
    <>
      <Form {...form}>
        <Stack className="justify-between">
          <H3 className="flex-1 truncate">{title}</H3>
        </Stack>
        <form onSubmit={handleFormSubmit} className={cx("grid gap-4 @sm:grid-cols-2", className)} noValidate {...props}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Ad name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ad Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ad type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(AdType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Website URL */}
          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Affiliate URL */}
          <FormField
            control={form.control}
            name="affiliateUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Affiliate URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://affiliate.example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Button Text */}
          <FormField
            control={form.control}
            name="buttonLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Button Text</FormLabel>
                <FormControl>
                  <Input placeholder="Click here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Short description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Date */}
          <FormField
            control={form.control}
            name="startsAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Date */}
          <FormField
            control={form.control}
            name="endsAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image URL */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/banner.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 col-span-full grid-cols-2">
            <FormField
              control={form.control}
              name="faviconUrl"
              render={({ field }) => (
                <FormItem className="items-stretch">
                  <Stack className="justify-between">
                    <FormLabel className="flex-1">Favicon URL</FormLabel>
                  </Stack>

                  <Stack size="sm">
                    {field.value && <img src={field.value} alt="Favicon" className="size-8 border box-content rounded-md object-contain" />}

                    <FormControl>
                      <Input type="url" className="flex-1" {...field} />
                    </FormControl>
                  </Stack>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Submit Button */}
          <Button type="submit">Save Ad</Button>
        </form>
      </Form>
    </>
  );
}
