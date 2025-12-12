"use client";

import { slugify } from "@primoui/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { RCategory } from "@prisma/client";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { useComputedField } from "@/hooks/use-computed-field";
import { cx } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { H3 } from "@/components/ui/heading";
import { Stack } from "@/components/ui/stack"; // Asumsi layout
import { Plus, Loader2, UploadCloud } from "lucide-react";

import { upsertResource, uploadResourceMedia } from "@/server/admin/resources/actions";
import { resourceSchema } from "@/server/admin/resources/schema";
import type { findResourceBySlug } from "@/server/admin/resources/queries";

type ResourceFormProps = ComponentProps<"form"> & {
  resource?: NonNullable<Awaited<ReturnType<typeof findResourceBySlug>>>;
};

export function ResourceForm({ className, title, resource, ...props }: ResourceFormProps) {
  const router = useRouter();

  // 1. Setup Form
  const form = useForm({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      id: resource?.id,
      name: resource?.name ?? "",
      slug: resource?.slug ?? "",
      websiteUrl: resource?.websiteUrl ?? "",
      repoUrl: resource?.repoUrl ?? "",
      category: resource?.category ?? RCategory.Template,
      media: resource?.media ?? [],
    },
  });

  // 2. Auto Slug
  useComputedField({
    form,
    sourceField: "name",
    computedField: "slug",
    callback: slugify,
    enabled: !resource,
  });

  // 3. Field Array untuk Media
  const {
    fields: mediaFields,
    append: appendMedia,
    remove: removeMedia,
  } = useFieldArray({
    control: form.control,
    name: "media",
  });

  const { execute: executeUpload, isPending: isUploading } = useServerAction(uploadResourceMedia, {
    onSuccess: ({ data }) => {
      toast.success("File uploaded successfully");
    },
    onError: ({ err }) => toast.error(err.message),
  });

  const upsertAction = useServerAction(upsertResource, {
    onSuccess: ({ data }) => {
      toast.success(`Resource successfully ${resource ? "updated" : "created"}`);
      router.push(`/admin/resources/${data.slug}`);
    },
    onError: ({ err }) => {
      toast.error(err.message);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Panggil server action upload
    const [res, err] = await executeUpload({
      resourceName: form.getValues("name") || "untitled",
      file,
    });

    if (err) return;

    if (res && res.url) {
      form.setValue(`media.${index}`, res.url);
    }
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await form.trigger();
    if (!isValid) return;

    const formData = form.getValues();

    await upsertAction.execute(formData);
  };

  return (
    <Form {...form}>
      <Stack className="justify-between w-full mb-6">
        <H3 className="flex-1 truncate">{title}</H3>
      </Stack>

      <form onSubmit={handleFormSubmit} className={cx("grid gap-4 @sm:grid-cols-2", className)} noValidate {...props}>
        {/* NAME */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Dashboard V1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SLUG */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="dashboard-v1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CATEGORY (ENUM) */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(RCategory).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* URLS */}
        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Website / Demo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repoUrl"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Repository URL</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* MEDIA SECTION (Simple Array of Strings) */}
        <div className="space-y-4 col-span-full border p-4 rounded-xl mt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Media (Images/Videos)</h3>
            <Button type="button" variant="secondary" size="sm" onClick={() => appendMedia("")}>
              <Plus className="w-4 h-4 mr-1" /> Add Slot
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">Paste URL manually OR click the upload button. Index 0 is the thumbnail.</p>

          {mediaFields.map((fieldItem, index) => (
            <div key={fieldItem.id} className="flex flex-col gap-2 p-3 border rounded-lg bg-muted/20">
              <div className="flex gap-2 items-start">
                {/* Input Text URL */}
                <FormField
                  control={form.control}
                  name={`media.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tombol Upload */}
                <div>
                  <input type="file" id={`file-upload-${index}`} className="hidden" accept="image/*,video/mp4" onChange={(e) => handleFileUpload(e, index)} disabled={isUploading} />
                  <Button type="button" disabled={isUploading} asChild>
                    <label htmlFor={`file-upload-${index}`} className="cursor-pointer">
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                    </label>
                  </Button>
                </div>

                {/* Tombol Hapus */}
                <Button type="button" variant="destructive" onClick={() => removeMedia(index)}>
                  Delete
                </Button>
              </div>

              {/* Preview */}
              {form.watch(`media.${index}`) && (
                <div className="rounded-md border overflow-hidden w-full h-40 bg-black/5 flex items-center justify-center">
                  {form.watch(`media.${index}`).endsWith(".mp4") ? (
                    <video src={form.watch(`media.${index}`)} className="h-full max-w-full object-contain" controls />
                  ) : (
                    <img src={form.watch(`media.${index}`)} alt="preview" className="h-full max-w-full object-contain" />
                  )}
                </div>
              )}
            </div>
          ))}

          {mediaFields.length === 0 && <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">No media added yet.</div>}
        </div>

        {/* SUBMIT BUTTONS */}
        <div className="flex justify-end gap-4 col-span-full mt-4">
          <Button type="button" onClick={() => router.push("/admin/resources")} disabled={upsertAction.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={upsertAction.isPending} isPending={upsertAction.isPending}>
            {resource ? "Update Resource" : "Create Resource"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
