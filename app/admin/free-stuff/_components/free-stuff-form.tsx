"use client";

import { slugify } from "@primoui/utils";
import { useState } from "react";
import { useServerAction } from "zsa-react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useComputedField } from "@/hooks/use-computed-field";
import { toast } from "sonner";
import { cx } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagCombobox } from "./tag-combobox";
import { freeStuffSchema } from "@/server/admin/free-stuff/schema";
import { upsertFreeStuff, autoFillPerk } from "@/server/admin/free-stuff/actions";
import { findStuffById } from "@/server/admin/free-stuff/queries";
import { PerkType } from "@prisma/client";
import { AIModelSelector, DEFAULT_AI_MODELS } from "../../_components/ai-model-selector";

type FreeStuffFormProps = React.ComponentProps<"form"> & {
  freeStuff?: NonNullable<Awaited<ReturnType<typeof findStuffById>>>;
  allTags: string[];
};

export function FreeStuffForm({ className, title, allTags, freeStuff, ...props }: FreeStuffFormProps) {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState("deepseek/deepseek-chat");

  const form = useForm({
    resolver: zodResolver(freeStuffSchema),
    defaultValues: {
      id: freeStuff?.id,
      name: freeStuff?.name ?? "",
      slug: freeStuff?.slug ?? "",
      logoUrl: freeStuff?.logoUrl ?? "",
      value: freeStuff?.value ?? "",
      description: freeStuff?.description ?? "",
      claimUrl: freeStuff?.claimUrl ?? "",
      type: freeStuff?.type ?? PerkType.Developer,
      tags: freeStuff?.tags?.map((t) => ({ value: t })) ?? [],
      isFree: freeStuff?.isFree ?? false,
    },
  });

  useComputedField({
    form,
    sourceField: "name",
    computedField: "slug",
    callback: slugify,
    enabled: !freeStuff,
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const autoFillAction = useServerAction(autoFillPerk, {
    onSuccess: ({ data }) => {
      if (data.name) form.setValue("name", data.name);
      if (data.description) form.setValue("description", data.description);
      if (data.value) form.setValue("value", data.value);
      if (data.isFree !== undefined) form.setValue("isFree", data.isFree);

      if (data.name) form.setValue("slug", slugify(data.name));

      if (data.tags && data.tags.length > 0) {
        form.setValue(
          "tags",
          data.tags.map((t: any) => ({ value: t }))
        );
      }

      toast.success("✨ Magic! Data auto-filled.");
    },
    onError: ({ err }) => toast.error(err.message),
  });

  const handleAutoFill = async () => {
    const url = form.getValues("claimUrl");
    if (!url) {
      toast.error("Please enter a URL first to analyze");
      return;
    }
    await autoFillAction.execute({ url, model: selectedModel });
  };
  const upsertAction = useServerAction(upsertFreeStuff, {
    onSuccess: ({ data }) => {
      toast.success(`Free stuff ${freeStuff ? "updated" : "created"}`);
      router.push(`/admin/free-stuff/${data.slug}`);
    },
    onError: ({ err }) => toast.error(err.message),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const valid = await form.trigger();
    if (!valid) return;

    const values = form.getValues();

    await upsertAction.execute({ id: freeStuff?.id, ...values });
  }

  return (
    <Form {...form}>
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="inline-flex -space-x-px divide-x divide-primary-foreground/30 rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse">
          <AIModelSelector models={DEFAULT_AI_MODELS} selectedModel={selectedModel} onModelChange={setSelectedModel} onAutoFill={handleAutoFill} isLoading={autoFillAction.isPending} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className={cx("grid gap-4 @sm:grid-cols-2", className)} noValidate {...props}>
        {/* Title */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* URL */}
        <FormField
          control={form.control}
          name="claimUrl"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Claim / Info URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Estimated Value
                <span className="text-xs text-muted-foreground ml-2">(e.g. $200/month)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="$..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem className="col-span-full">
          <FormLabel>Tags</FormLabel>

          {/* Existing tag inputs */}
          {tagFields.map((tag, index) => (
            <div key={tag.id} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name={`tags.${index}.value`}
                render={({ field }) => (
                  <FormControl>
                    <Input placeholder="Enter a tag" value={field.value || ""} onChange={(e) => field.onChange(e.target.value)} />
                  </FormControl>
                )}
              />

              <Button type="button" variant="secondary" size="sm" onClick={() => removeTag(index)}>
                Remove
              </Button>
            </div>
          ))}

          {/* Combobox for selecting existing tags */}
          <TagCombobox options={allTags} onSelect={(tagString) => appendTag({ value: tagString })} />

          <FormMessage />
        </FormItem>

        {/* Perk Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Perk Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {Object.keys(PerkType).map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description — full width */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/free-stuff">Cancel</Link>
          </Button>
          <Button size="md" type="submit" disabled={upsertAction.isPending}>
            {freeStuff ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
