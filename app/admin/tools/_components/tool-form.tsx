"use client";

import { formatDateTime, getRandomString, isValidUrl, slugify } from "@primoui/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Tool, ToolStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { use, useState } from "react";
import { useForm, useFieldArray, Control } from "react-hook-form";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { generateFavicon } from "@/actions/media";
import { MultiSelectCheckbox } from "@/components/admin/multi-select-checkbox";
import { RelationSelector } from "@/components/admin/relation-selector";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ToolPublishActions } from "./tool-publish-actions";
import { H3 } from "@/components/ui/heading";
import { RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { Stack } from "@/components/ui/stack";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink } from "@/components/web/external-link";
import { useComputedField } from "@/hooks/use-computed-field";
import type { findCategoryList } from "@/server/admin/categories/queries";
import { upsertTool } from "@/server/admin/tools/actions";
import type { findToolBySlug } from "@/server/admin/tools/queries";
import type { findPlatformList } from "@/server/admin/platforms/queries";
import { StackCombobox } from "./stack-combobox";
import type { findStackList } from "@/server/admin/stacks/queries";
import { toolSchema, type ToolSchema } from "@/server/admin/tools/schema";
import { cx } from "@/lib/utils";

const ToolStatusChange = ({ tool }: { tool: Tool }) => {
  return (
    <>
      <ExternalLink href={`/${tool.slug}`} className="font-semibold underline inline-block">
        {tool.name}
      </ExternalLink>{" "}
      is now {tool.status.toLowerCase()}.{" "}
      {tool.status === "Scheduled" && (
        <>
          Will be published on {formatDateTime(tool.publishedAt ?? new Date(), "long")} ({Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/^.+\//, "")}).
        </>
      )}
    </>
  );
};

type ToolFormProps = ComponentProps<"form"> & {
  tool?: NonNullable<Awaited<ReturnType<typeof findToolBySlug>>>;
  categoriesPromise: ReturnType<typeof findCategoryList>;
  platformsPromise: ReturnType<typeof findPlatformList>;
  stacksPromise: ReturnType<typeof findStackList>;
};

export function ToolForm({ className, title, tool, categoriesPromise, platformsPromise, stacksPromise, ...props }: ToolFormProps) {
  const router = useRouter();
  const categories = use(categoriesPromise);
  const platformOptions = use(platformsPromise);
  const stackOptions = use(stacksPromise);
  const [isStatusPending, setIsStatusPending] = useState(false);
  const [originalStatus, setOriginalStatus] = useState(tool?.status ?? ToolStatus.Draft);

  const form = useForm({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: tool?.name ?? "",
      slug: tool?.slug ?? "",
      tagline: tool?.tagline ?? "",
      description: tool?.description ?? "",
      websiteUrl: tool?.websiteUrl ?? "",
      affiliateUrl: tool?.affiliateUrl ?? "",
      repositoryUrl: tool?.repositoryUrl ?? "",
      faviconUrl: tool?.faviconUrl ?? "",
      screenshotUrl: tool?.screenshotUrl ?? "",
      status: tool?.status ?? ToolStatus.Draft,
      publishedAt: tool?.publishedAt ?? null,
      categories: tool?.categories.map((c) => c.id) ?? [],
      platforms: tool?.platforms.map((p) => p.id) ?? [],
      stacks: tool?.stacks.map((s) => s.slug) ?? [],
      screenshots:
        tool?.screenshots?.map((img) => ({
          imageUrl: img.imageUrl,
          caption: img.caption ?? "",
          githubUrl: img.githubUrl ?? "", // ✅ tambahan
        })) ?? [],
    },
  });

  // otomatis isi form slug berdasarkan nama
  useComputedField({
    form,
    sourceField: "name",
    computedField: "slug",
    callback: slugify,
    enabled: !tool,
  });

  if (!stacksPromise) {
    throw new Error("stacksPromise tidak diberikan ke ToolForm");
  }

  const {
    fields: screenshotFields,
    append: appendScreenshot,
    remove: removeScreenshot,
  } = useFieldArray({
    control: form.control,
    name: "screenshots",
  });

  const {
    fields: stackFields,
    append: appendStack,
    remove: removeStack,
  } = useFieldArray({
    control: form.control as unknown as Control<ToolSchema>,
    name: "stacks",
  });

  // Keep track of the form values
  const [slug, websiteUrl] = form.watch(["slug", "websiteUrl"]);

  // Upsert tool
  const upsertAction = useServerAction(upsertTool, {
    onSuccess: ({ data }) => {
      console.log("🔥 upsertAction onSuccess, data:", data);
      if (data.status !== originalStatus) {
        toast.success(<ToolStatusChange tool={data} />);
        setOriginalStatus(data.status);
      }
      // Otherwise, just show a success message
      else {
        toast.success(`Tool successfully ${tool ? "updated" : "created"}`);
      }

      // If not updating a tool, or slug has changed, redirect to the new tool
      if (!tool || data.slug !== tool?.slug) {
        router.push(`/admin/tools/${data.slug}`);
      }
    },

    onError: ({ err }) => {
      console.error("🔥 upsertAction onError:", err);
      toast.error(err.message);
    },
    onFinish: () => setIsStatusPending(false),
  });

  // Generate favicon
  const faviconAction = useServerAction(generateFavicon, {
    onSuccess: ({ data }) => {
      toast.success("Favicon successfully generated. Please save the tool to update.");
      form.setValue("faviconUrl", data);
    },

    onError: ({ err }) => toast.error(err.message),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log("🔥 handleSubmit triggered");
    console.log("🔥 Submitting Tool Data", data);
    console.log("tool?.id:", tool?.id);
    upsertAction.execute({ id: tool?.id, ...data });
  });

  const handleStatusSubmit = (status: ToolStatus, publishedAt: Date | null) => {
    form.setValue("status", status);
    form.setValue("publishedAt", publishedAt);
    setIsStatusPending(true);
    handleSubmit();
  };

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>
      </Stack>

      <form onSubmit={handleSubmit} className={cx("grid gap-4 @sm:grid-cols-2", className)} noValidate {...props}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input data-1p-ignore {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="affiliateUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Affiliate URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repositoryUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository URL</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagline</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Platforms Field (Multi-Select) */}
        <FormField
          control={form.control}
          name="platforms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platforms</FormLabel>
              <FormControl>
                <MultiSelectCheckbox options={platformOptions} value={field.value ?? []} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stacks Field (Dynamic Input with useFieldArray) */}
        <FormItem>
          <FormLabel>Stacks</FormLabel>
          {stackFields.map((stack, index) => (
            <div key={stack.id} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name={`stacks.${index}`}
                render={({ field }) => (
                  <FormControl>
                    <Input placeholder="Enter stack (e.g., React)" {...field} />
                  </FormControl>
                )}
              />
              <Button type="button" variant="secondary" size="sm" onClick={() => removeStack(index)}>
                Remove
              </Button>
            </div>
          ))}
          <StackCombobox options={stackOptions} onSelect={(slug) => appendStack(slug)} />

          <FormMessage />
        </FormItem>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 col-span-full">
          <h3 className="font-semibold text-lg">Screenshots</h3>
          {screenshotFields.map((screenshot, index) => (
            <div key={screenshot.id ?? index} className="grid sm:grid-cols-2 gap-4 items-end border p-4 rounded-xl">
              <FormField
                control={form.control}
                name={`screenshots.${index}.imageUrl`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`screenshots.${index}.caption`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caption</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Homepage Screenshot" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`screenshots.${index}.githubUrl`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://github.com/..." />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="col-span-2 text-right">
                <Button type="button" size="sm" variant="destructive" onClick={() => removeScreenshot(index)}>
                  Hapus Screenshot
                </Button>
              </div>
            </div>
          ))}

          <Button type="button" variant="secondary" onClick={() => appendScreenshot({ imageUrl: "", caption: "", githubUrl: "" })}>
            + Tambah Screenshot
          </Button>
        </div>

        <div className="grid gap-4 col-span-full grid-cols-2">
          <FormField
            control={form.control}
            name="faviconUrl"
            render={({ field }) => (
              <FormItem className="items-stretch">
                <Stack className="justify-between">
                  <FormLabel className="flex-1">Favicon URL</FormLabel>

                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    prefix={<RefreshCw className={cx(faviconAction.isPending && "animate-spin")} />}
                    className="-my-1"
                    disabled={!isValidUrl(websiteUrl) || faviconAction.isPending}
                    onClick={() => {
                      faviconAction.execute({
                        url: websiteUrl,
                        path: `tools/${slug || getRandomString(12)}`,
                      });
                    }}
                  >
                    {field.value ? "Regenerate" : "Generate"}
                  </Button>
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
          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categories</FormLabel>
                <RelationSelector
                  relations={categories}
                  selectedIds={field.value ?? []}
                  setSelectedIds={field.onChange}
                  mapFunction={({ id, name, fullPath }) => {
                    const depth = fullPath.split("/").length - 1;
                    const prefix = "- ".repeat(depth);
                    return { id, name: `${prefix}${name}` };
                  }}
                  sortFunction={(a, b) => {
                    const aSegments = a.fullPath.split("/");
                    const bSegments = b.fullPath.split("/");
                    for (let i = 0; i < Math.min(aSegments.length, bSegments.length); i++) {
                      if (aSegments[i] !== bSegments[i]) {
                        return aSegments[i].localeCompare(bSegments[i]);
                      }
                    }
                    return aSegments.length - bSegments.length;
                  }}
                />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/tools">Cancel</Link>
          </Button>

          <ToolPublishActions isPending={upsertAction.isPending} isStatusPending={isStatusPending} onStatusSubmit={handleStatusSubmit} />
        </div>
      </form>
    </Form>
  );
}
